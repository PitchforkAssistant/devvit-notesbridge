import {ToolboxClient} from "toolbox-devvit";

export const defaultToolboxNoteKeys = [
    "gooduser",
    "spamwatch",
    "spamwarn",
    "abusewarn",
    "ban",
    "permban",
    "botban",
    "",
];

export async function getToolboxNoteKeys (toolbox: ToolboxClient, subredditName?: string) {
    if (!subredditName) {
        subredditName = (await toolbox.reddit.getCurrentSubreddit()).name;
    }

    const toolboxConfig = await toolbox.getConfig(subredditName);
    const noteTypes = toolboxConfig.getAllNoteTypes();
    const noteTypeKeys = noteTypes.map(noteType => noteType.key);
    return noteTypeKeys;
}

export async function filterDefaultToolboxNoteKeys (noteKeys: string[]) {
    return noteKeys.filter(noteKey => !defaultToolboxNoteKeys.includes(noteKey));
}

export async function getCustomToolboxNoteKeys (toolbox: ToolboxClient, subredditName?: string) {
    const noteKeys = await getToolboxNoteKeys(toolbox, subredditName);
    return filterDefaultToolboxNoteKeys(noteKeys);
}
