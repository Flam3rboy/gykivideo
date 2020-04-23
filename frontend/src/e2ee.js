export default class E2EE {
	arrayBufferToBase64(arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer);
		var byteString = "";
		for (var i = 0; i < byteArray.byteLength; i++) {
			byteString += String.fromCharCode(byteArray[i]);
		}
		var b64 = window.btoa(byteString);

		return b64;
	}

	addNewLines(str) {
		var finalString = "";
		while (str.length > 0) {
			finalString += str.substring(0, 64) + "\n";
			str = str.substring(64);
		}

		return finalString;
	}

	toPem({ privateKey, publicKey }) {
		if (privateKey) {
			var b64 = this.addNewLines(this.arrayBufferToBase64(privateKey));
			var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";
		} else if (publicKey) {
			var b64 = this.addNewLines(this.arrayBufferToBase64(publicKey));
			var pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
		}

		return pem;
	}

	async generateKeys() {
		var t0 = performance.now();

		// Let's generate the key pair first
		var keyPair = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048, // can be 1024, 2048 or 4096
				publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
				hash: { name: "SHA-256" }, // or SHA-512
			},
			true,
			["encrypt", "decrypt"]
		);

		var t1 = performance.now();
		console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
		/* now when the key pair is generated we are going to export it from the keypair object in pkcs8 */
		var privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
		// converting exported private key to PEM format
		var pem = this.toPem({ privateKey });
		console.log(pem);
	}
}
