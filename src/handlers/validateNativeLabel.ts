import {SettingsFormFieldValidatorEvent, UserNoteLabel} from "@devvit/public-api";
import {ERRORS} from "../constants.js";

export function isNativeLabel (label: string): label is UserNoteLabel {
    const nativeLabels: UserNoteLabel[] = [
        "BOT_BAN",
        "PERMA_BAN",
        "BAN",
        "ABUSE_WARNING",
        "SPAM_WARNING",
        "SPAM_WATCH",
        "SOLID_CONTRIBUTOR",
        "HELPFUL_USER",
    ];
    return nativeLabels.includes(label as UserNoteLabel);
}

export async function validateNativeLabel (event: SettingsFormFieldValidatorEvent<string[]>): Promise<string | void> {
    if (!event.value) {
        return ERRORS.T2N_NONE_SELECTED;
    }

    if (event.value.length === 0) {
        return ERRORS.T2N_NONE_SELECTED;
    }

    if (event.value.length > 1) {
        return ERRORS.T2N_MULTIPLE_SELECTED;
    }

    if (event.value[0].length === 0) {
        return ERRORS.T2N_NONE_SELECTED;
    }

    if (!isNativeLabel(event.value[0])) {
        return ERRORS.T2N_INVALID_LABEL;
    }
}
