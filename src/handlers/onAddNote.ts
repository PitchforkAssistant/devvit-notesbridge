import {ModAction, User, Subreddit, TriggerContext} from "@devvit/public-api";
import {isNativeLabel} from "./validateNativeLabel.js";
import {KEYS, N2T_KEY_MAP} from "../constants.js";
import {getToolboxNoteKeys} from "../helpers/toolboxLabels.js";
import {ToolboxClient, Usernote} from "toolbox-devvit";

// Note reasons:
// added note ArchivalBotTesting (bop: abuse_warning)
// deleted note ArchivalBotTesting
export async function onAddNote ({reddit, settings}: TriggerContext, modAction: ModAction, subreddit?: Subreddit, moderator?: User) {
    console.log("onAddNote called!");
    if (!subreddit) {
        subreddit = await reddit.getSubredditById(modAction.subredditId);
    }
    if (!moderator) {
        moderator = await reddit.getUserById(modAction.moderatorId);
    }

    const isEnabled = await settings.get<boolean>(KEYS.N2T_ENABLED) ?? false;
    if (!isEnabled) {
        return;
    }

    if (!modAction.target || !modAction.target.id) {
        throw `onAddNote called with no target: ${modAction.description}`;
        return;
    }

    if (!modAction.details) {
        console.warn("onAddNote called with no details", modAction);
        return;
    }

    const targetUser = await reddit.getUserById(modAction.target.id);
    // we can't use reddit.getModNotes because it's broken as of 0.10.17
    // if a user has any notes with no linked item, the entire call fails

    const nativeNoteLabel = modAction.description?.toUpperCase().trim() ?? "";
    if (nativeNoteLabel !== "" && !isNativeLabel(nativeNoteLabel)) {
        console.warn("onAddNote called with no valid label", modAction);
        return;
    }
    const toolboxNoteLabel = await settings.get<string>(N2T_KEY_MAP[nativeNoteLabel]) ?? "";

    const toolbox = new ToolboxClient(reddit);
    if (toolboxNoteLabel && !(await getToolboxNoteKeys(toolbox)).includes(toolboxNoteLabel)) {
        throw `onAddNote called with no valid toolbox label for ${nativeNoteLabel}:${toolboxNoteLabel}`;
    }

    const toolboxNotes = await toolbox.getUsernotes(subreddit.name);
    const newToolboxNote: Usernote = {
        moderatorUsername: moderator.username,
        noteType: toolboxNoteLabel,
        text: modAction.details,
        timestamp: modAction.createdAt,
        username: targetUser.username,
    };
    console.log("Adding new TB note: ", newToolboxNote);
    toolboxNotes.add(newToolboxNote);
    await toolbox.writeUsernotes(subreddit.name, toolboxNotes, `"clone new native note on user ${targetUser.username}" via NotesBridge`);
}
