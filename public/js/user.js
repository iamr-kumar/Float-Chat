import { KeyPairType } from '@virgilsecurity/e3kit-browser';

const EThree = E3kit.EThree;

class User {
    constructor(identity) {
        this.identity = identity;
        this.benchmarking = false;
    }

    async initialize(identity) {
        // Get virgil token from the api
        async function getVrigilToken() {
            const response = await fetch("http://localhost:3000/virgil-jwt", {
                headers: {
                    Authorization: `Bearer ${identity}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Error code: ${response.status} \n Message: ${response.statusText}`
                );
            }
            // Return token
            return response.json().then((data) => data.token);
        }

        let eThree = null;
        try {
            // initialize eThree for this user using the token
            eThree = await EThree.initialize(getVrigilToken);
        } catch (err) {
            console.log(err.message);
        }

        this.eThree = eThree;
    }

    getEThree() {
        if (!this.eThree) {
            throw new Error("eThree not initialized!");
        }
        return this.eThree;
    }

    async register() {
        const eThree = this.getEThree();
        try {
            await eThree.register();
            console.log("Registered!");
        } catch (err) {
            if (err.name === "IdentityAlreadyExistsError") {
                await eThree.cleanup();
                await eThree.rotatePrivateKey();
                console.log("Rotated private key instead!");
            } else {
                console.log("Failed to initialize");
            }
        }
    }

    async findUser(identity) {
        const eThree = this.getEThree();
        let foundUser = null;
        try {
            foundUser = await eThree.findUsers(identity);
            console.log(`Looked up ${identity}'s cards with public keys`);
        } catch (err) {
            console.log(
                `Failed to look up ${identity}'s card with public keys: ${err}`
            );
        }

        return foundUser;
    }

    async authEncrypt(text, recipientCard) {
        const eThree = this.getEThree();
        let encryptedText = null;
        let repetitions = this.benchmarking ? 100 : 1;
        try {
            encryptedText = await eThree.authEncrypt(text, recipientCard);
            console.log("Encrypted and signed!");
        } catch (err) {
            console.log("Failed encrypting and signing!");
        }

        return encryptedText;
    }

    async authDecrypt(text, senderCard) {
        const eThree = this.getEThree();
        let decryptedText = null;
        try {
            decryptedText = await eThree.authDecrypt(text, senderCard);
            console.log("Decrypted and verified!");
        } catch (err) {
            console.log(err);
            console.log("Failed to decrypt and verify!");
        }
        return decryptedText;
    }
}
