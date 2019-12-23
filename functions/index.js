const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

function deleteCollection(db, collectionPath) {
    return db.collection(collectionPath).get()
        .then(snapshot => {
            if(snapshot.size === 0) {return 0}
            console.log(snapshot);
            for(var doc of snapshot.docs){
                console.log(1, doc);
                doc.ref.delete();
            }
            return 0
        })
  }

exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
    // ...
    await admin.firestore().doc('/env/local/users/' + user.uid).set({Email: user.email});
    await admin.firestore().doc('/env/development/users/' + user.uid).set({Email: user.email});
    await admin.firestore().doc('/env/staging/users/' + user.uid).set({Email: user.email});
    return admin.firestore().doc('/env/production/users/' + user.uid).set({Email: user.email});
});

exports.deleteUserDocument = functions.auth.user().onDelete(async (user) => {
    // ...
    await admin.firestore().doc('/env/local/users/' + user.uid).delete();
    await admin.firestore().doc('/env/development/users/' + user.uid).delete();
    await admin.firestore().doc('/env/staging/users/' + user.uid).delete();
    return admin.firestore().doc('/env/production/users/' + user.uid).delete();
});

exports.mirrorCustomClaims = functions.firestore.document('user-claims/{uid}').onWrite(async (change, context) => {
    const beforeData = change.before.data() || {}
    const afterData = change.after.data() || {}
    // Skip updates where _lastCommitted field changed,
    // to avoid infinite loops
    const skipUpdate =
        beforeData._lastCommitted &&
        afterData._lastCommitted &&
        !beforeData._lastCommitted.isEqual(afterData._lastCommitted)
    if (skipUpdate) {
        console.log("No changes")
        return
    }

    // Create a new JSON payload and check that it's under
    // the 1000 character max
    const claims = Object.assign({}, afterData);
    const document = Object.assign({}, claims);
    delete claims._lastCommitted;
    document._lastCommitted = admin.firestore.FieldValue.serverTimestamp()
    //delete afterData._lastCommitted;
    const stringifiedClaims = JSON.stringify(claims)
    if (stringifiedClaims.length > 1000) {
        console.error("New custom claims object string > 1000 characters", stringifiedClaims)
        return
    }
    const uid = context.params.uid
    console.log(`Setting custom claims for ${uid}`, claims)
    await admin.auth().setCustomUserClaims(uid, claims)
    console.log('Updating document timestamp')
    const newObject = await change.after.ref.update(document);
})