


// src/services/authService.ts
// import { User } from '../types/ index';

// class AuthService {
//     async login(email: string, pass: string): Promise<User> {
//         // FAKE LOGIN
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         if (email && pass) {
//         return { id: 'user-123', email: email };
//         }
//         throw new Error('Invalid credentials');
//     }

//     async register(email: string, pass: string): Promise<User> {
//         // FAKE REGISTER
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return { id: 'user-123', email: email };
//     }

//     async logout(): Promise<void> {
//         return;
//     }

//     getCurrentUser(): User | null {
//         return null; // Start as logged out
//     }
// }

// export default new AuthService();


import auth from '@react-native-firebase/auth';
import { User } from '../types/ index';

class AuthService {
    async login(email: string, pass: string): Promise<User> {
        const credential = await auth().signInWithEmailAndPassword(email, pass);
        return {
        id: credential.user.uid,
        email: credential.user.email || '',
        };
    }

    async register(email: string, pass: string): Promise<User> {
        const credential = await auth().createUserWithEmailAndPassword(email, pass);
        return {
        id: credential.user.uid,
        email: credential.user.email || '',
        };
    }

    async logout(): Promise<void> {
        await auth().signOut();
    }

    getCurrentUser(): User | null {
        const user = auth().currentUser;
        if (user) {
        return { id: user.uid, email: user.email || '' };
        }
        return null;
    }
}

export default new AuthService();