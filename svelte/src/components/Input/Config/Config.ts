import type { UserConfig } from "./configTypes";

export default class Config {
  attributes: UserConfig;

  propertyChangedEvent = new Event("propertyChanged");

  constructor() {
    // this._listeners = {};
    this.attributes = {
      // infos: {
      //   display: "Infos",
      //   default: { value: "list" },
      //   fieldsGroups: {
      //     list: {
      //       fields: [
      //         { key: "Name", value: "" },
      //         { key: "Firstname", value: "" }
      //       ]
      //     }
      //   }
      // },
      storage: {
        kre_display: "Storage",
        default: "ipfs",
        ipfs: {
          kre_display: "IPFS",
          apiEndpoint: "",
          apiKey: ""
        },
        swarm: {
          kre_display: "Swarm",
          apiEndpoint: "",
          apiKey: ""
        }
      },
      options: {
        kre_display: "Options",
        default: "list",
        list: {
          kre_editable: true,
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