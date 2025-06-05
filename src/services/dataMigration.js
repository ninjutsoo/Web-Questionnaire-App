import { db } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { getQuestionnaire } from './questionnaireService';

// Migration script to move data from old structure to new structure
export const migrateUserData = async () => {
  try {
    console.log('🔄 Starting data migration...');
    
    // Step 1: Ensure Questions collection exists
    console.log('📋 Setting up Questions collection...');
    await getQuestionnaire(); // This will create the default questionnaire if it doesn't exist
    
    // Step 2: Get all users with questionnaire data
    console.log('👥 Finding users with questionnaire data...');
    const usersRef = collection(db, 'Users');
    const usersSnapshot = await getDocs(usersRef);
    
    let migratedCount = 0;
    let totalUsers = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      totalUsers++;
      
      // Check if user has old questionnaire responses
      if (userData.questionnaireResponses) {
        console.log(`📝 Migrating data for user: ${userId}`);
        
        // Step 3: Create new Answer session with consistent ID
        const sessionId = `${userId}_4ms_health`;
        const answerData = {
          userId: userId,
          questionnaireId: "4ms_health",
          status: "completed", // Assume old data was completed
          responses: userData.questionnaireResponses,
          createdAt: userData.questionnaireLastUpdated || new Date(),
          updatedAt: new Date(),
          migratedFrom: "legacy_users_collection"
        };
        
        // Save to new Answers collection
        await setDoc(doc(db, 'Answers', sessionId), answerData);
        
        // Step 4: Clean up old data from Users collection (optional)
        await updateDoc(doc(db, 'Users', userId), {
          questionnaireResponses: deleteField(),
          questionnaireLastUpdated: deleteField()
        });
        
        migratedCount++;
        console.log(`✅ Migrated user ${userId} - Session: ${sessionId}`);
      }
    }
    
    console.log(`🎉 Migration completed!`);
    console.log(`📊 Results:`);
    console.log(`   - Total users checked: ${totalUsers}`);
    console.log(`   - Users migrated: ${migratedCount}`);
    console.log(`   - Users with no questionnaire data: ${totalUsers - migratedCount}`);
    
    return {
      success: true,
      totalUsers,
      migratedCount,
      message: `Successfully migrated ${migratedCount} users`
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Migration failed - check console for details'
    };
  }
};

// Check what data would be migrated (dry run)
export const previewMigration = async () => {
  try {
    console.log('🔍 Previewing migration data...');
    
    const usersRef = collection(db, 'Users');
    const usersSnapshot = await getDocs(usersRef);
    
    const usersWithData = [];
    let totalUsers = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      totalUsers++;
      
      if (userData.questionnaireResponses) {
        usersWithData.push({
          userId,
          email: userData.email || 'No email',
          hasResponses: !!userData.questionnaireResponses,
          sectionsCompleted: Object.keys(userData.questionnaireResponses || {}).length,
          lastUpdated: userData.questionnaireLastUpdated?.toDate?.() || 'Unknown'
        });
      }
    }
    
    console.log('📋 Migration Preview:');
    console.log(`   - Total users: ${totalUsers}`);
    console.log(`   - Users with questionnaire data: ${usersWithData.length}`);
    console.log('   - Details:', usersWithData);
    
    return {
      totalUsers,
      usersToMigrate: usersWithData.length,
      userDetails: usersWithData
    };
    
  } catch (error) {
    console.error('❌ Preview failed:', error);
    return { error: error.message };
  }
};

// Verify migration results
export const verifyMigration = async () => {
  try {
    console.log('🔍 Verifying migration...');
    
    // Check Questions collection
    const questionnaireExists = await getDoc(doc(db, 'Questions', '4ms_health'));
    
    // Check Answers collection
    const answersRef = collection(db, 'Answers');
    const answersSnapshot = await getDocs(answersRef);
    
    // Check Users collection for remaining questionnaire data
    const usersRef = collection(db, 'Users');
    const usersSnapshot = await getDocs(usersRef);
    
    let usersWithOldData = 0;
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.questionnaireResponses) {
        usersWithOldData++;
      }
    }
    
    const results = {
      questionnaireExists: questionnaireExists.exists(),
      totalAnswerSessions: answersSnapshot.size,
      usersWithOldData: usersWithOldData,
      migrationComplete: usersWithOldData === 0
    };
    
    console.log('📊 Migration Verification:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return { error: error.message };
  }
}; 