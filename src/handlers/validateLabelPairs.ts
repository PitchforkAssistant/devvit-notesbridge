import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {ToolboxClient} from "toolbox-devvit";
import {getCustomToolboxNoteKeys} from "../helpers/toolboxLabels.js";
import {ERRORS} from "../constants.js";
import {isNativeLabel} from "./validateNativeLabel.js";

// Toolbox: "Keys can only contain a-z, 0-9, -, and _."
// Native: typeof UserNoteLabel
export async function validateLabelPairs (event: SettingsFormFieldValidatorEvent<string>, context: Context) {
    const toolbox = new ToolboxClient(context.reddit);
    const customNoteKeys = await getCustomToolboxNoteKeys(toolbox);

    if (customNoteKeys.length === 0) {
        if (event.value && event.value.trim().length > 0) {
            return ERRORS.N2T_NOT_NEEDED;
        }
    }

    if (!event.value || event.value.trim().length === 0) {
        return ERRORS.N2T_NEEDED + customNoteKeys.join(", ");
    }

    const pairs = event.value.split("\n");
    const seenKeys: string[] = [];

    const invalidPairs: string[] = [];
    const invalidNativeKeys: string[] = [];
    const invalidToolboxKeys: string[] = [];
    const duplicateToolboxKeys: string[] = [];

    for (const pair of pairs) {
        const splitPair = pair.split(":");

        if (splitPair.length !== 2) {
            invalidPairs.push(pair);
            continue;
        }

        const [toolboxLabel, nativeLabel] = splitPair;
        if (seenKeys.includes(toolboxLabel)) {
            duplicateToolboxKeys.push(pair);
        } else {
            seenKeys.push(toolboxLabel);
        }

        if (!customNoteKeys.includes(toolboxLabel)) {
            invalidToolboxKeys.push(pair);
        }

        if (!isNativeLabel(nativeLabel)) {
            invalidNativeKeys.push(pair);
        }
    }

    const missingToolboxKeys: string[] = customNoteKeys.filter(key => !seenKeys.includes(key));

    if (invalidPairs.length > 0) {
        return `${ERRORS.N2T_INVALID_PAIRS}\n${invalidPairs.join("\n")}`;
    }

    if (invalidToolboxKeys.length > 0) {
        return `${ERRORS.N2T_INVALID_TOOLBOX_LABEL}\n${invalidToolboxKeys.join("\n")}`;
    }

    if (invalidNativeKeys.length > 0) {
        return `${ERRORS.N2T_INVALID_NATIVE_LABEL}\n${invalidNativeKeys.join("\n")}`;
    }

    if (missingToolboxKeys.length > 0) {
        return `${ERRORS.N2T_MISSING_TOOLBOX_LABEL}\n${missingToolboxKeys.join("\n")}`;
    }

    if (duplicateToolboxKeys.length > 0) {
        return `${ERRORS.N2T_DUPLICATE_TOOLBOX_LABEL}\n${duplicateToolboxKeys.join("\n")}`;
    }
}
