/**
 * @author: Abinash Biswal
 * @description: Utility module. Can be used for general purposes
 */

import { pushNotification } from "../components/Snackbar/toastUtils";
import lodash from "lodash";
import axios from "axios";
import { AES, enc } from "crypto-js";
import "format-unicorn";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

class MainUtils {}

class NotificationUtil extends MainUtils {
  constructor(notificationType = null, message = null, translateCodes = []) {
    super();
    this._notificationType = notificationType;
    this._message = message;
    this._translateCodes = translateCodes;
  }
  notify() {
    pushNotification({
      type: this._notificationType,
      message: this._message,
      translateCodes: this._translateCodes,
    });
  }
}

class Util extends MainUtils {
  stringify(input) {
    return JSON.stringify(input);
  }
  format(message, formatList) {
    var response = message;
    var formatSelector = {};
    for (var i = 0; i < formatList.length; i++) {
      formatSelector[i] = formatList[i];
    }
    response = response.formatUnicorn(formatSelector);
    return response;
  }
}

class ResponseUtil {
  #default_resp = {
    data: null,
    reasons: null,
    statusCode: 404,
    values: null,
    responseId: null,
    translateCodes: [],
  };
  constructor(resp) {
    this._response = resp;
  }
  getRestData() {
    return this._response ? this._response.data : this.#default_resp;
  }
  checkValidResponse() {
    return this._response && this.getRestData();
  }
  getReasons() {
    var reasons = this.getRestData().reasons;
    return reasons;
  }
  getStatusCode() {
    var statusCode = this.getRestData().statusCode;
    return statusCode;
  }
  getValuesFromResponse() {
    var values = this.getRestData().values;
    return values;
  }
  getResponseId() {
    return this.getRestData().responseId;
  }
  getTranslateCodes() {
    return this.getRestData().translateCodes;
  }
  getNotificationType() {
    var statusCode = this.getStatusCode();
    if (statusCode >= 200 && statusCode <= 299) {
      return "success";
    }
    return "error";
  }
}

class EncryptionUtil extends MainUtils {
  #encrypt_key;
  constructor() {
    super();
    this.#encrypt_key = "#";
  }
  #encrypt = function (data) {
    return AES.encrypt(data, this.#encrypt_key).toString();
  };

  encryptKeyStable(key) {
    // This function encrypts key by ensuring that the encrypted key must remain same
    // if the same key is encrypted again by this function
    var encryptedKey = Buffer.from(String(key)).toString("base64");
    return encryptedKey;
  }

  getEncryptedValue(key) {
    var util = new Util();
    var encrypted = "";
    if (lodash.isObject(key)) {
      encrypted = this.#encrypt(util.stringify(key));
    } else {
      encrypted = this.#encrypt(String(key));
    }
    return encrypted;
  }

  encryptPayload(payload) {
    payload = this.getEncryptedValue(payload);
    return payload;
  }

  DecryptKey(key) {
    var wordArray = AES.decrypt(key, "#");
    var utf8String = wordArray.toString(enc.Utf8);
    try {
      var obj = JSON.parse(utf8String);
      return obj;
    } catch (exc) {
      return utf8String || key;
    }
  }
}

class RestUtil extends EncryptionUtil {
  async makeRequest(callOptions) {
    try {
      var result = await axios(callOptions);
    } catch (exc) {
      result = exc?.response;
    }
    var RespUtil = new ResponseUtil(result);
    return RespUtil;
  }
}

class firebase {
  #firebase_configuration = {
    apiKey: "AIzaSyDlO4qyATWgt93_AzZlmXNzNp--KOzFxfU",
    authDomain: "crm-app-4a1bf.firebaseapp.com",
    projectId: "crm-app-4a1bf",
    storageBucket: "crm-app-4a1bf.appspot.com",
    messagingSenderId: "285116286508",
    appId: "1:285116286508:web:f7c1267e6284d3861c7389",
    measurementId: "G-DN5SYJH2P2",
  };
  #fireapp;
  #fireanalytics;
  #firestoredb;
  constructor() {
    this.#fireapp = initializeApp(this.#firebase_configuration);
    this.#fireanalytics = getAnalytics(this.#fireapp);
    this.#firestoredb = getFirestore();
  }
  getFireApp() {
    return this.#fireapp;
  }
  getFireAnalytics() {
    return this.#fireanalytics;
  }
  getFireDB() {
    return this.#firestoredb;
  }
}

// Instances
const util = new Util();
const encUtil = new EncryptionUtil();
const RESTService = new RestUtil();
const fire = new firebase();

export {
  RestUtil,
  EncryptionUtil,
  ResponseUtil,
  NotificationUtil,
  util,
  encUtil,
  RESTService,
  fire
};
