import type { UserConfig } from "./configTypes";

export default class Config {
  attributes: UserConfig;

  propertyChangedEvent = new Event("propertyChanged");

  constructor() {
    // this._listeners = {};
    this.attributes = {
      infos: {
        display: "Infos",
        default: { value: "list" },
        fieldsGroups: {
          list: {
            fields: [
              { key: "Name", value: "" },
              { key: "Firstname", value: "" }
            ]
          }
        }
      },
      storage: {
        display: "Storage",
        default: { display: "Active storage", value: "ipfs" },
        fieldsGroups: {
          ipfs: {
            display: "IPFS",
            fields: [
              { key: "apiEndpoint", value: "", display: "API end Point" },
              { key: "apiKey", value: "" }
            ]
          },
          swarm: {
            display: "Swarm",
            fields: [
              { key: "apiEndpoint", value: "" },
              { key: "apiKey", value: "" }
            ]
          }
        }
      },
      options: {
        display: "Options",
        default: { value: "list" },
        fieldsGroups: {
          list: {
            editable: true,
            fields: []
          }
        }
      }
    };
  }

  loadConfigFromFile = () => {

  };

  localConfigSet = () => {

  };

  localConfigInit = () => {

  };

  getConfig = () => {
    return this.attributes;
  };

  deleteAttribute = () => {

  };

  addAttribute = () => {

  };

  addField(namespace: string): void {
    const fields = this.attributes[namespace].fieldsGroups[this.attributes[namespace].default.value].fields;
    this.attributes[namespace].fieldsGroups[this.attributes[namespace].default.value].fields = [...fields, { key: "", value: "" }];

    document.dispatchEvent(this.propertyChangedEvent);
  }

  removeField(namespace: string, i: number): void {
    const fields = this.attributes[namespace].fieldsGroups[this.attributes[namespace].default.value].fields;
    // if (fields.length > 1) {
    this.attributes[namespace].fieldsGroups[this.attributes[namespace].default.value].fields = fields.filter((_, index) => i !== index);
    // } else {
    // this.attributes[namespace].fieldsGroups[this.attributes[namespace].default.value].fields[i] = { key: "", value: "" };
    // }

    document.dispatchEvent(this.propertyChangedEvent);
  }


  //////////////////////////////////////////////
  // actual localStorage storage structure
  // let storage = {
  //   default: "swarm",
  //   swarm: {
  //     apiEndpoint: "http://localhost:1633",
  //     apiKey: "f2b69cfcb5666586d028e965f75fc19bd3eba48313591cf61418856f6904d5d4"
  //   }
}