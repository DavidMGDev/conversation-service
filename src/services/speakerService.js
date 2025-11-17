const Speaker = require('../models/Speaker');

async function getAllSpeakers() {

  try {

    return await Speaker.find().select('-__v').lean();

  } catch (error) {

    console.error('❌ Error fetching speakers:', error.message);

    throw new Error('Failed to fetch speakers');

  }

}

async function getSavedSpeakers(userId) {

  // Simplified: return first 3 speakers as example

  // TODO: Implement real UserSpeakers collection

  try {

    const speakers = await Speaker.find().limit(3).select('id name avatarSeed flagEmoji').lean();

    return speakers;

  } catch (error) {

    console.error('❌ Error fetching saved speakers:', error.message);

    throw error;

  }

}

async function addSpeaker(userId, speakerData) {

  try {

    const speaker = await Speaker.findOne({ id: speakerData.id });

    if (!speaker) throw new Error('Speaker not found');

    // TODO: Save to UserSpeakers collection

    return { success: true, message: 'Speaker added successfully' };

  } catch (error) {

    console.error('❌ Error adding speaker:', error.message);

    throw error;

  }

}

module.exports = { getAllSpeakers, getSavedSpeakers, addSpeaker };
