import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      "turbo/no-undeclared-env-vars": [
        "warn",
        { allowList: ["DATABASE_URL", "NODE_ENV"] },
      ],
    },
  },
  {
    ignores: ["generated/**", "node_modules/**"],
  },
];
