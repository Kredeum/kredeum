type UserConfig = Record<string, ConfigSection>;

type ConfigSection = {
  display?: string;
  default: { display?: string; value: string };
  fieldsGroups?: Record<string, FieldGroup>;
}

type FieldGroup = {
  display?: string;
  editable?: boolean;
  fields: Field[];
 };

type Field = {
  key: string;
  value: string;
  display?: string;
  editableKey?: boolean;
  deletable?: boolean;
 };

export type {
  UserConfig,
  ConfigSection,
};