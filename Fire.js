import firebase from "firebase";

class Fire {
    constructor() {
        this.init();
       
    }

    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyABjDdiaYm83rEkUsEG-u5aeegZrhNDSKs",
                authDomain: "family-social-communicat-b54bb.firebaseapp.com",
                databaseURL: "https://family-social-communicat-b54bb.firebaseio.com",
                projectId: "family-social-communicat-b54bb",
                storageBucket: "family-social-communicat-b54bb.appspot.com",
                messagingSenderId: "954697433619",
                appId: "1:954697433619:web:24ed30743d12f703e835e6"
            });
        }
    };

    checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
        });
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };

            this.db.push(message);
        });
    };

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);

        return {
            _id,
            createdAt,
            text,
            user
        };
    };

    get = callback => {
        this.db.on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    off() {
        this.db.off();
    }

    get db() {
        return firebase.database().ref("botTry");
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }
    get uName() {
        return (firebase.auth().currentUser.displayName || {});
    }
}

export default new Fire();
