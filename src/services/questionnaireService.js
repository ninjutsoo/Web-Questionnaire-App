import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const LIKERT_SLIDER_CONFIG = {
  happiness: {
    min: 1,
    max: 10,
    step: 1,
    scaleMinLabel: 'Not at all happy',
    scaleMaxLabel: 'Very happy',
    neutralLabel: 'Neutral'
  },
  memory: {
    min: 1,
    max: 10,
    step: 1,
    scaleMinLabel: 'Not worried',
    scaleMaxLabel: 'Very worried',
    neutralLabel: 'Somewhat worried'
  },
  sleep: {
    min: 1,
    max: 10,
    step: 1,
    scaleMinLabel: 'Very poor sleep',
    scaleMaxLabel: 'Excellent sleep',
    neutralLabel: 'Okay sleep'
  }
};

const applyLikertSliderConfig = (questionnaire) => {
  if (!questionnaire?.sections?.mind?.questions) return questionnaire;
  const updatedQuestions = { ...questionnaire.sections.mind.questions };
  Object.entries(LIKERT_SLIDER_CONFIG).forEach(([key, config]) => {
    if (updatedQuestions[key]?.type === 'slider') {
      updatedQuestions[key] = { ...updatedQuestions[key], ...config };
    }
  });
  return {
    ...questionnaire,
    sections: {
      ...questionnaire.sections,
      mind: {
        ...questionnaire.sections.mind,
        questions: updatedQuestions
      }
    }
  };
};

const withOther = (tags = []) => {
  if (!Array.isArray(tags)) return ['Other'];
  return tags.includes('Other') ? tags : [...tags, 'Other'];
};

const getMarch6MedicationQuestions = () => ({
  q1: {
    text: "What prescribed medications are you currently taking?",
    type: "tag_text",
    tags: ["Blood Pressure", "Diabetes", "Heart", "Pain", "Dementia medication", "Mental Health", "Other"]
  },
  q2: {
    text: "What \"over the counter\" medications are you currently taking?",
    type: "tag_text",
    tags: ["Vitamins", "herps", "fiber supplements", "allergy medications", "other"]
  },
  q3: {
    text: "Do you have any concerns about your medications?",
    type: "tag_text",
    tags: ["Side Effects", "Too Many", "Cost", "Effectiveness", "Interactions", "Forgetting"]
  },
  q4: {
    text: "How often do you miss doses?",
    type: "tag_text",
    tags: ["Never", "Rarely", "Sometimes", "Often", "Multiple Times", "Need Help", "Other"]
  },
  q5: {
    text: "How do you manage your medication?",
    type: "tag_text",
    tags: ["days of the week pill box", "reminder app", "timer", "caregiver assistance", "other"]
  }
});

const applyMarch6QuestionnaireUpdates = (questionnaire) => {
  if (!questionnaire?.sections) return { data: questionnaire, changed: false };

  const next = JSON.parse(JSON.stringify(questionnaire));
  let changed = false;

  // What Matters: add Other to all questions
  const mattersQuestions = next.sections?.matters?.questions || {};
  Object.keys(mattersQuestions).forEach((key) => {
    const q = mattersQuestions[key];
    if (q?.type === 'tag_text') {
      const updatedTags = withOther(q.tags);
      if ((q.tags || []).length !== updatedTags.length || !updatedTags.every((t, i) => t === q.tags?.[i])) {
        q.tags = updatedTags;
        changed = true;
      }
    }
  });

  // Medication: replace with required March 6 structure
  const desiredMedication = getMarch6MedicationQuestions();
  const currentMedication = next.sections?.medication?.questions || {};
  if (JSON.stringify(currentMedication) !== JSON.stringify(desiredMedication)) {
    next.sections.medication = {
      ...(next.sections.medication || {}),
      questions: desiredMedication
    };
    changed = true;
  }

  // Mentation (mind): update q5-q7 text and add Other to q4-q7
  const mindQuestions = next.sections?.mind?.questions || {};
  const mindTextUpdates = {
    q5: "Is there anything that has been causing you stress lately?",
    q6: "When you need support, what kind of support do you find most helpful?",
    q7: "If you were looking for support around well-being, what would feel most helpful?"
  };
  ['q4', 'q5', 'q6', 'q7'].forEach((key) => {
    const q = mindQuestions[key];
    if (q?.type === 'tag_text') {
      const updatedTags = withOther(q.tags);
      if ((q.tags || []).length !== updatedTags.length || !updatedTags.every((t, i) => t === q.tags?.[i])) {
        q.tags = updatedTags;
        changed = true;
      }
      if (mindTextUpdates[key] && q.text !== mindTextUpdates[key]) {
        q.text = mindTextUpdates[key];
        changed = true;
      }
    }
  });

  // Mobility: add Other to all tag_text questions and add two options to q2
  const mobilityQuestions = next.sections?.mobility?.questions || {};
  Object.keys(mobilityQuestions).forEach((key) => {
    const q = mobilityQuestions[key];
    if (q?.type === 'tag_text') {
      let updatedTags = withOther(q.tags);
      if (key === 'q2') {
        if (!updatedTags.includes('Dizziness')) updatedTags.push('Dizziness');
        if (!updatedTags.includes('Fear of falling')) updatedTags.push('Fear of falling');
      }
      if ((q.tags || []).length !== updatedTags.length || !updatedTags.every((t, i) => t === q.tags?.[i])) {
        q.tags = updatedTags;
        changed = true;
      }
    }
  });

  if (changed) {
    next.updatedAt = new Date();
  }

  return { data: next, changed };
};

// Get the questionnaire structure
export const getQuestionnaire = async () => {
  try {
    console.log('Attempting to load questionnaire from Firebase...');
    const docRef = doc(db, 'Questions', '4ms_health');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Questionnaire loaded from Firebase successfully');
      let questionnaireData = applyLikertSliderConfig(docSnap.data());
      const march6Result = applyMarch6QuestionnaireUpdates(questionnaireData);
      questionnaireData = march6Result.data;
      if (march6Result.changed) {
        await setDoc(docRef, questionnaireData);
      }
      
      // Check if we need to update with new mobilityType question
      if (!questionnaireData.sections?.mobility?.questions?.mobilityType) {
        console.log('Updating existing questionnaire with new mobility question...');
        const updated = await updateQuestionnaireWithMobilityType();
        return applyLikertSliderConfig(updated);
      }
      
      return questionnaireData;
    } else {
      console.log('Questionnaire not found, creating default...');
      // Create default questionnaire if it doesn't exist
      const defaultQuestionnaire = {
        name: "4 Ms Health Assessment",
        version: "1.0",
        sections: {
          matters: {
            questions: {
              q1: { text: "What activities bring you the most joy?", type: "tag_text", tags: ["Family Time", "Reading", "Exercise", "Cooking", "Travel", "Music", "Other"] },
              q2: { text: "What are your main concerns in life right now?", type: "tag_text", tags: ["Health", "Finance", "Family", "Independence", "Safety", "Loneliness", "Other"] },
              q3: { text: "What are your most important goals?", type: "tag_text", tags: ["Stay Healthy", "Family Time", "Travel", "Independence", "Learn New Things", "Help Others", "Other"] },
              q4: { text: "What kind of support do you need most?", type: "tag_text", tags: ["Medical Care", "Family Support", "Transportation", "Home Help", "Social Activities", "Financial", "Other"] }
            }
          },
          medication: {
            questions: getMarch6MedicationQuestions()
          },
          mind: {
            questions: {
              happiness: { text: "How happy do you feel most days?", type: "slider", ...LIKERT_SLIDER_CONFIG.happiness },
              memory: { text: "How worried are you about your memory?", type: "slider", ...LIKERT_SLIDER_CONFIG.memory },
              sleep: { text: "How would you rate your sleep quality?", type: "slider", ...LIKERT_SLIDER_CONFIG.sleep },
              q4: { text: "What mental health concerns do you have?", type: "tag_text", tags: ["Anxiety", "Depression", "Stress", "Loneliness", "Grief", "Fear", "Other"] },
              q5: { text: "Is there anything that has been causing you stress lately?", type: "tag_text", tags: ["Health", "Family", "Money", "Safety", "Future", "Memory", "Other"] },
              q6: { text: "When you need support, what kind of support do you find most helpful?", type: "tag_text", tags: ["Prayer", "Exercise", "Family", "Friends", "Hobbies", "Professional Help", "Other"] },
              q7: { text: "If you were looking for support around well-being, what would feel most helpful?", type: "tag_text", tags: ["Counseling", "Support Groups", "Medication", "Family Help", "Social Activities", "Spiritual Care", "Other"] }
            }
          },
          mobility: {
            questions: {
              mobilityType: { 
                text: "How do you normally get around?", 
                type: "mobility_type", 
                options: ["Bedrest", "Walker", "Wheelchair", "Independent"],
                tips: {
                  "Bedrest": {
                    title: "Bedrest Safety Tips",
                    content: "Turn reminders every two hours and a \"Why Turn\" section with a description of the importance of turning to prevent bed sores",
                    details: "Regular turning helps prevent pressure ulcers (bed sores) and improves circulation. Set reminders to change position every 2 hours."
                  },
                  "Walker": {
                    title: "Walker Safety Tips", 
                    content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                    details: "Always have someone nearby when getting up. Sit at the edge first, check for dizziness, then stand slowly with support."
                  },
                  "Wheelchair": {
                    title: "Wheelchair Exercise Tips",
                    content: "Once in the chair try a couple of arm raises, side twist, and knee/ toe raises",
                    details: "Regular movement helps maintain strength and flexibility. Try arm raises, side twists, and knee/toe raises while seated."
                  },
                  "Independent": {
                    title: "Independent Movement Safety Tips",
                    content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                    details: "Even when moving independently, it's safer to have someone nearby. Always check for dizziness before standing."
                  }
                }
              },
              q1: { text: "What mobility challenges do you face?", type: "tag_text", tags: ["Walking", "Stairs", "Balance", "Standing", "Getting Up", "Pain", "Other"] },
              q2: { text: "What is your current exercise routine?", type: "tag_text", tags: ["Daily Walk", "Gym", "Swimming", "Yoga", "Physical Therapy", "None", "Dizziness", "Fear of falling", "Other"] },
              q3: { text: "Do you use any mobility aids?", type: "tag_text", tags: ["Cane", "Walker", "Wheelchair", "Grab Bars", "Ramp", "None", "Other"] },
              q4: { text: "What are your concerns about falling?", type: "tag_text", tags: ["Balance Problems", "Weakness", "Dizziness", "Medications", "Home Hazards", "No Concerns", "Other"] }
            }
          }
        },
        isActive: true,
        updatedAt: new Date()
      };
      
      const questionnaireWithLikert = applyLikertSliderConfig(defaultQuestionnaire);
      await setDoc(docRef, questionnaireWithLikert);
      console.log('Default questionnaire created successfully');
      return questionnaireWithLikert;
    }
  } catch (error) {
    console.error('Error getting questionnaire:', error);
    console.error('Error details:', error.code, error.message);
    
    // Return fallback questionnaire if Firebase fails
    console.log('Returning fallback questionnaire due to Firebase error');
    return getFallbackQuestionnaire();
  }
};

// Fallback questionnaire in case Firebase fails
const getFallbackQuestionnaire = () => {
  return applyMarch6QuestionnaireUpdates(applyLikertSliderConfig({
    name: "4 Ms Health Assessment",
    version: "1.0",
    sections: {
      matters: {
        questions: {
          q1: { text: "What activities bring you the most joy?", type: "tag_text", tags: ["Family Time", "Reading", "Exercise", "Cooking", "Travel", "Music", "Other"] },
          q2: { text: "What are your main concerns in life right now?", type: "tag_text", tags: ["Health", "Finance", "Family", "Independence", "Safety", "Loneliness", "Other"] },
          q3: { text: "What are your most important goals?", type: "tag_text", tags: ["Stay Healthy", "Family Time", "Travel", "Independence", "Learn New Things", "Help Others", "Other"] },
          q4: { text: "What kind of support do you need most?", type: "tag_text", tags: ["Medical Care", "Family Support", "Transportation", "Home Help", "Social Activities", "Financial", "Other"] }
        }
      },
      medication: {
        questions: getMarch6MedicationQuestions()
      },
      mind: {
        questions: {
          happiness: { text: "How happy do you feel most days?", type: "slider", ...LIKERT_SLIDER_CONFIG.happiness },
          memory: { text: "How worried are you about your memory?", type: "slider", ...LIKERT_SLIDER_CONFIG.memory },
          sleep: { text: "How would you rate your sleep quality?", type: "slider", ...LIKERT_SLIDER_CONFIG.sleep },
          q4: { text: "What mental health concerns do you have?", type: "tag_text", tags: ["Anxiety", "Depression", "Stress", "Loneliness", "Grief", "Fear", "Other"] },
          q5: { text: "Is there anything that has been causing you stress lately?", type: "tag_text", tags: ["Health", "Family", "Money", "Safety", "Future", "Memory", "Other"] },
          q6: { text: "When you need support, what kind of support do you find most helpful?", type: "tag_text", tags: ["Prayer", "Exercise", "Family", "Friends", "Hobbies", "Professional Help", "Other"] },
          q7: { text: "If you were looking for support around well-being, what would feel most helpful?", type: "tag_text", tags: ["Counseling", "Support Groups", "Medication", "Family Help", "Social Activities", "Spiritual Care", "Other"] }
        }
      },
      mobility: {
        questions: {
          mobilityType: { 
            text: "How do you normally get around?", 
            type: "mobility_type", 
            options: ["Bedrest", "Walker", "Wheelchair", "Independent"],
            tips: {
              "Bedrest": {
                title: "Bedrest Safety Tips",
                content: "Turn reminders every two hours and a \"Why Turn\" section with a description of the importance of turning to prevent bed sores",
                details: "Regular turning helps prevent pressure ulcers (bed sores) and improves circulation. Set reminders to change position every 2 hours."
              },
              "Walker": {
                title: "Walker Safety Tips", 
                content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                details: "Always have someone nearby when getting up. Sit at the edge first, check for dizziness, then stand slowly with support."
              },
              "Wheelchair": {
                title: "Wheelchair Exercise Tips",
                content: "Once in the chair try a couple of arm raises, side twist, and knee/ toe raises",
                details: "Regular movement helps maintain strength and flexibility. Try arm raises, side twists, and knee/toe raises while seated."
              },
              "Independent": {
                title: "Independent Movement Safety Tips",
                content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                details: "Even when moving independently, it's safer to have someone nearby. Always check for dizziness before standing."
              }
            }
          },
          q1: { text: "What mobility challenges do you face?", type: "tag_text", tags: ["Walking", "Stairs", "Balance", "Standing", "Getting Up", "Pain", "Other"] },
          q2: { text: "What is your current exercise routine?", type: "tag_text", tags: ["Daily Walk", "Gym", "Swimming", "Yoga", "Physical Therapy", "None", "Dizziness", "Fear of falling", "Other"] },
          q3: { text: "Do you use any mobility aids?", type: "tag_text", tags: ["Cane", "Walker", "Wheelchair", "Grab Bars", "Ramp", "None", "Other"] },
          q4: { text: "What are your concerns about falling?", type: "tag_text", tags: ["Balance Problems", "Weakness", "Dizziness", "Medications", "Home Hazards", "No Concerns", "Other"] }
        }
      }
    },
    isActive: true,
    updatedAt: new Date()
  })).data;
};

// Create or get user session
export const getUserSession = async (userId) => {
  try {
    console.log('Creating/getting user session for:', userId);
    // Use consistent session ID per user - no timestamp!
    const sessionId = `${userId}_4ms_health`;
    const docRef = doc(db, 'Answers', sessionId);
    
    try {
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Existing session found:', sessionId);
        return { sessionId: sessionId, data: docSnap.data() };
      } else {
        console.log('Creating new session:', sessionId);
        // Create new session
        const newSession = {
          userId: userId,
          questionnaireId: "4ms_health",
          status: "draft",
          responses: {
            matters: {},
            medication: {},
            mind: {},
            mobility: {}
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(docRef, newSession);
        console.log('New session created successfully');
        return { sessionId: sessionId, data: newSession };
      }
    } catch (sessionError) {
      console.error('Error with session Firebase operations:', sessionError);
      // Return fallback session without saving to Firebase
      console.log('Returning fallback session');
      const fallbackSession = {
        userId: userId,
        questionnaireId: "4ms_health", 
        status: "draft",
        responses: {
          matters: {},
          medication: {},
          mind: {},
          mobility: {}
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return { sessionId: sessionId, data: fallbackSession };
    }
  } catch (error) {
    console.error('Error getting user session:', error);
    console.error('Error details:', error.code, error.message);
    
    // Return fallback session structure
    const fallbackSessionId = `${userId}_fallback_${Date.now()}`;
    const fallbackSession = {
      userId: userId,
      questionnaireId: "4ms_health",
      status: "draft", 
      responses: {
        matters: {},
        medication: {},
        mind: {},
        mobility: {}
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return { sessionId: fallbackSessionId, data: fallbackSession };
  }
};

// Save response to a question
export const saveResponse = async (sessionId, section, questionId, answer) => {
  try {
    const docRef = doc(db, 'Answers', sessionId);
    await updateDoc(docRef, {
      [`responses.${section}.${questionId}`]: answer,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving response:', error);
    throw error;
  }
};

// Save entire section responses
export const saveSectionResponses = async (sessionId, section, responses) => {
  try {
    console.log('Saving section responses:', section, 'for session:', sessionId);
    const docRef = doc(db, 'Answers', sessionId);
    await updateDoc(docRef, {
      [`responses.${section}`]: responses,
      updatedAt: new Date()
    });
    console.log('Section responses saved successfully');
  } catch (error) {
    console.error('Error saving section responses:', error);
    console.error('Error details:', error.code, error.message);
    
    // Don't throw error - let the UI continue working
    // In a production app, you might want to queue this for retry
    console.log('Continuing without saving to Firebase (offline mode)');
  }
};

// Mark session as completed
export const completeSession = async (sessionId) => {
  try {
    const docRef = doc(db, 'Answers', sessionId);
    await updateDoc(docRef, {
      status: "completed",
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error completing session:', error);
    throw error;
  }
};

// Get session data
export const getSessionData = async (sessionId) => {
  try {
    const docRef = doc(db, 'Answers', sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting session data:', error);
    throw error;
  }
};

// Update existing questionnaire with new mobility question
export const updateQuestionnaireWithMobilityType = async () => {
  try {
    console.log('Updating questionnaire with new mobility type question...');
    const docRef = doc(db, 'Questions', '4ms_health');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const existingData = docSnap.data();
      
      // Check if mobilityType question already exists
      if (!existingData.sections?.mobility?.questions?.mobilityType) {
        console.log('Adding mobilityType question to existing questionnaire...');
        
        // Add the new mobilityType question to the beginning of mobility questions
        const updatedMobilityQuestions = {
          mobilityType: { 
            text: "How do you normally get around?", 
            type: "mobility_type", 
            options: ["Bedrest", "Walker", "Wheelchair", "Independent"],
            tips: {
              "Bedrest": {
                title: "Bedrest Safety Tips",
                content: "Turn reminders every two hours and a \"Why Turn\" section with a description of the importance of turning to prevent bed sores",
                details: "Regular turning helps prevent pressure ulcers (bed sores) and improves circulation. Set reminders to change position every 2 hours."
              },
              "Walker": {
                title: "Walker Safety Tips", 
                content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                details: "Always have someone nearby when getting up. Sit at the edge first, check for dizziness, then stand slowly with support."
              },
              "Wheelchair": {
                title: "Wheelchair Exercise Tips",
                content: "Once in the chair try a couple of arm raises, side twist, and knee/ toe raises",
                details: "Regular movement helps maintain strength and flexibility. Try arm raises, side twists, and knee/toe raises while seated."
              },
              "Independent": {
                title: "Independent Movement Safety Tips",
                content: "When standing up make sure you have another person in the room with you to reduce the fall risk. Before standing up, sit at the edge of the bed and or chair, make sure you are not experiencing any dizziness.",
                details: "Even when moving independently, it's safer to have someone nearby. Always check for dizziness before standing."
              }
            }
          },
          ...existingData.sections.mobility.questions
        };
        
        const updatedQuestionnaire = {
          ...existingData,
          sections: {
            ...existingData.sections,
            mobility: {
              ...existingData.sections.mobility,
              questions: updatedMobilityQuestions
            }
          },
          updatedAt: new Date()
        };
        
        await setDoc(docRef, updatedQuestionnaire);
        console.log('Questionnaire updated successfully with mobilityType question');
        return updatedQuestionnaire;
      } else {
        console.log('mobilityType question already exists in questionnaire');
        return existingData;
      }
    } else {
      console.log('No existing questionnaire found, creating new one...');
      return await getQuestionnaire(); // This will create the default with mobilityType
    }
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    // Return fallback questionnaire if update fails
    return getFallbackQuestionnaire();
  }
};

// Get user questionnaire data for AI context
export const getUserQuestionnaireContext = async (userId) => {
  try {
    console.log('Getting questionnaire context for user:', userId);
    
    // Get user session data
    const sessionId = `${userId}_4ms_health`;
    const sessionData = await getSessionData(sessionId);
    
    if (!sessionData || !sessionData.responses) {
      console.log('No questionnaire data found for user');
      return null;
    }
    
    // Get questionnaire structure to map question IDs to text
    const questionnaire = await getQuestionnaire();
    
    // Format the responses for AI context
    const context = {
      userId: userId,
      completedSections: [],
      responses: {}
    };
    
    const sections = ['matters', 'medication', 'mind', 'mobility'];
    
    sections.forEach(sectionKey => {
      const sectionResponses = sessionData.responses[sectionKey] || {};
      const sectionQuestions = questionnaire?.sections?.[sectionKey]?.questions || {};
      
      // Only include sections that have answered questions
      const answeredQuestions = Object.entries(sectionResponses).filter(([questionId, response]) => {
        if (!response) return false;
        
        if (typeof response === 'object' && response !== null) {
          // Tag + text questions - count as answered if has tags OR text
          return (response.tags && response.tags.length > 0) || (response.text && response.text.trim());
        } else if (typeof response === 'number' || (typeof response === 'string' && response.trim())) {
          // Slider or text questions - count if not empty
          return true;
        }
        return false;
      });
      
      if (answeredQuestions.length > 0) {
        context.completedSections.push(sectionKey);
        context.responses[sectionKey] = {};
        
        answeredQuestions.forEach(([questionId, response]) => {
          const questionText = sectionQuestions[questionId]?.text || questionId;

          // Do not include caregiverEmail in AI context
          if (sectionKey === 'mobility' && questionId === 'caregiverEmail') {
            // Commented out: skip adding caregiverEmail to context
            // let formattedResponse = response;
            // context.responses[sectionKey][questionText] = formattedResponse;
            return;
          }

          let formattedResponse = '';
          if (typeof response === 'object' && response !== null) {
            if (response.tags && response.tags.length > 0) {
              formattedResponse = `Selected: ${response.tags.join(', ')}`;
            }
            if (response.text && response.text.trim()) {
              formattedResponse += formattedResponse ? ` | Additional notes: ${response.text}` : response.text;
            }
          } else if (typeof response === 'number') {
            formattedResponse = `Rating: ${response}/10`;
          } else if (typeof response === 'string') {
            formattedResponse = response;
          }
          
          context.responses[sectionKey][questionText] = formattedResponse;
        });
      }
    });
    
    console.log('Questionnaire context prepared:', context.completedSections.length, 'sections completed');
    return context;
    
  } catch (error) {
    console.error('Error getting questionnaire context:', error);
    return null;
  }
}; 
