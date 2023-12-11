import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import speakeasy from "speakeasy";
import base32 from "hi-base32";

export default function Home() {
  const [secret, setSecret] = useState<speakeasy.GeneratedSecret>();

  const [inputToken, setInputToken] = useState<string>("");

  const [isValid, setIsValid] = useState<boolean>(false);

  function generateSecret() {
    const _sec = speakeasy.generateSecret({ length: 20, name: "2FA Test" });
    setSecret(_sec);
  }

  function toHex(str: string) {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
      hex += "" + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  function validate() {
    console.log(secret?.base32, inputToken);
    if (!secret?.base32 || !inputToken) return;
    const secretAscii = base32.decode(secret?.base32);
    const secretHex = toHex(secretAscii);

    if (secret?.base32 && inputToken) {
      const verified = speakeasy.totp.verify({
        secret: secretHex,
        encoding: "hex",
        token: inputToken,
      });
      setIsValid(verified);
    }
  }

  return (
    <div>
      <div>
        <p>Generate Secret</p>
        <button onClick={generateSecret}>Generate</button>
        <p>{JSON.stringify(secret)}</p>
      </div>
      <hr />
      <div>
        <p>QR Code</p>
        {secret?.otpauth_url && (
          <QRCodeSVG
            value={secret?.otpauth_url}
            className="border-2 border-gray-50"
          />
        )}
        <p>{secret?.otpauth_url}</p>
      </div>
      <hr />
      <div>
        <p>Validate</p>
        <input
          type="text"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          className="text-black bg-white border border-black"
        />
        <button onClick={validate}>Validate</button>
        <p>{isValid ? "Valid" : "Invalid"}</p>
      </div>
    </div>
  );
}
