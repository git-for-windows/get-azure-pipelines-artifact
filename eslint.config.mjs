import { defineConfig, globalIgnores } from "eslint/config";
import jest from "eslint-plugin-jest";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import antiTrojanSource from "eslint-plugin-anti-trojan-source";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["**/dist/", "**/lib/", "**/node_modules/", "**/jest.config.js"]),
    {
        extends: compat.extends("plugin:github/recommended"),

        plugins: {
            jest,
            "@typescript-eslint": typescriptEslint,
            "@stylistic": stylistic,
            "anti-trojan-source": antiTrojanSource,
        },

        files: ["**/*.ts"],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parser: tsParser,
            ecmaVersion: 9,
            sourceType: "module",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/consistent-type-assertions": "error",

            "@typescript-eslint/explicit-function-return-type": ["error", {
                allowExpressions: true,
            }],

            "@typescript-eslint/explicit-member-accessibility": ["error", {
                accessibility: "no-public",
            }],

            "@stylistic/function-call-spacing": ["error", "never"],
            "@typescript-eslint/no-array-constructor": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-extraneous-class": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unnecessary-qualifier": "error",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/prefer-function-type": "warn",
            "@typescript-eslint/prefer-includes": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/promise-function-async": "error",
            "@typescript-eslint/require-array-sort-compare": "error",
            "@typescript-eslint/restrict-plus-operands": "error",
            "@stylistic/semi": ["error", "never"],
            "@stylistic/type-annotation-spacing": "error",
            "@typescript-eslint/unbound-method": "error",
            "anti-trojan-source/no-bidi": "error",
            camelcase: "off",
            "eslint-comments/no-use": "off",
            "filenames/match-regex": "off",
            "i18n-text/no-en": "off",
            "import/no-namespace": "off",
            "no-unused-vars": "off",
            semi: "off",
        },
    },
]);