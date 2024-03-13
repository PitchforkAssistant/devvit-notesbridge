import {Context, SettingsFormFieldValidatorEvent} from "@devvit/public-api";
import {ToolboxClient} from "toolbox-devvit";
import {ERRORS} from "../constants.js";
import {getToolboxNoteKeys} from "../helpers/toolboxLabels.js";

export async function validateToolboxLabel (event: SettingsFormFieldValidatorEvent<string>, context: Context) {
    if (!event.value) {
        return; // Blank is allowed in this direction
    }
    const toolbox = new ToolboxClient(context.reddit);
    const noteTypeKeys = await getToolboxNoteKeys(toolbox);

    if (!noteTypeKeys.includes(event.value)) {
        return ERRORS.N2T_INVALID_NOTE_TYPE + noteTypeKeys.join(", ");
    }
}
