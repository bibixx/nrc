//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...tanstackConfig,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooks.configs["recommended-latest"],
  {
    rules: {
      "react/display-name": "off",
      "react/prop-types": "off",
      "@typescript-eslint/array-type": "off",
    },
  },
];
