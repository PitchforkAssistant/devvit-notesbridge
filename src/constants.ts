/* eslint-disable camelcase */
// Keeping all of the labels, help texts, error messages, and default values in one place makes keeps main.ts cleaner and makes them easier to change.
// It also opens up the possibility of internationalization in the future.

import {FieldConfig_Selection_Item} from "@devvit/protos";
import {UserNoteLabel} from "@devvit/public-api";

export const LABELS = {
    IGNORED_USERS: "Ignored Users",

    N2T_GROUP: "Native Notes to Toolbox Notes",
    N2T_ENABLED: "Copy Native Notes to Toolbox Notes",
    N2T_MAP_GROUP: "Label Mappings for Native to Toolbox Notes",

    N2T_MAP_BOT_BAN: "Bot Ban",
    N2T_MAP_PERMA_BAN: "Permanent Ban",
    N2T_MAP_BAN: "Ban",
    N2T_MAP_ABUSE_WARNING: "Abuse Warning",
    N2T_MAP_SPAM_WARNING: "Spam Warning",
    N2T_MAP_SPAM_WATCH: "Spam Watch",
    N2T_MAP_SOLID_CONTRIBUTOR: "Solid Contributor",
    N2T_MAP_HELPFUL_USER: "Helpful User",
    N2T_MAP_NONE: "None",

    T2N_GROUP: "Toolbox Notes to Native Notes",
    T2N_ENABLED: "Copy Toolbox Notes to Native Notes",
    T2N_MAP_GROUP: "Label Mappings for Toolbox to Native Notes",

    T2N_MAP_BOTBAN: "Bot Ban",
    T2N_MAP_PERMBAN: "Permanent Ban",
    T2N_MAP_BAN: "Ban",
    T2N_MAP_ABUSEWARN: "Abuse Warning",
    T2N_MAP_SPAMWARN: "Spam Warning",
    T2N_MAP_SPAMWATCH: "Spam Watch",
    T2N_MAP_GOODUSER: "Good Contributor",
    T2N_MAP_NONE: "None",
    T2N_MAP_CUSTOM: "Custom Toolbox Note Labels",
};

export const HELP_TEXTS = {
    IGNORED_USERS: "A comma-separated list of usernames. Notes authored by these users will always be ignored.",

    N2T_GROUP: "These settings control how Native Notes are copied to the Toolbox Notes feature.",
    N2T_ENABLED: "Enable this setting if you want newly created Native Notes to be copied to the Toolbox Notes feature.",
    N2T_MAP_GROUP: "Native and Toolbox Note labels are not the same, so you'll need to enter a corresponding Toolbox Note label for each Native Note label.",

    N2T_MAP_BOT_BAN: "BOT_BAN",
    N2T_MAP_PERMA_BAN: "PERMA_BAN",
    N2T_MAP_BAN: "BAN",
    N2T_MAP_ABUSE_WARNING: "ABUSE_WARNING",
    N2T_MAP_SPAM_WARNING: "SPAM_WARNING",
    N2T_MAP_SPAM_WATCH: "SPAM_WATCH",
    N2T_MAP_SOLID_CONTRIBUTOR: "SOLID_CONTRIBUTOR",
    N2T_MAP_HELPFUL_USER: "HELPFUL_USER",
    N2T_MAP_NONE: "",

    T2N_GROUP: "These settings control how Toolbox Notes are copied to the Native Notes feature.",
    T2N_ENABLED: "Enable this setting if you want newly created Toolbox Notes to be copied to the Native Notes feature.",
    T2N_MAP_GROUP: "Toolbox and Native Note labels are not the same, so you'll need to enter a corresponding Native Note label for each Toolbox Note label. If your subreddit has custom Toolbox Note labels, you'll also need to define their counterparts in the text field at the bottom of this section.",

    T2N_MAP_BOTBAN: "botban",
    T2N_MAP_PERMBAN: "permban",
    T2N_MAP_BAN: "ban",
    T2N_MAP_ABUSEWARN: "abusewarn",
    T2N_MAP_SPAMWARN: "spamwarn",
    T2N_MAP_SPAMWATCH: "spamwatch",
    T2N_MAP_GOODUSER: "gooduser",
    T2N_MAP_NONE: "",
    T2N_MAP_CUSTOM: "If your subreddit has custom Toolbox Note labels, enter their corresponding Native Note labels here. Use the format 'Toolbox Note Label:Native Note Label' with each pair on its own line. Native Note labels should be one of the following: BOT_BAN, PERMA_BAN, BAN, ABUSE_WARNING, SPAM_WARNING, SPAM_WATCH, SOLID_CONTRIBUTOR, or HELPFUL_USER. Example: customhelpfuluserlabel:HELPFUL_USER",
};

export const ERRORS = {
    T2N_NONE_SELECTED: "You must select a corresponding Native Note label for this Toolbox Note label. Due to Devvit limitations, it is not currently possible to set a note with no label.",
    T2N_MULTIPLE_SELECTED: "You can only select one corresponding Native Note label for this Toolbox Note label.",
    T2N_INVALID_LABEL: "The selected note type is not a valid Native Note label.",
    N2T_INVALID_NOTE_TYPE: "The entered note type is not defined in the subreddit's Toolbox config. Please enter one of the following defined labels: ",
    N2T_NOT_NEEDED: "Your subreddit does not have any custom Toolbox Note labels, please leave this text field blank and use the options above.",
    N2T_NEEDED: "Your subreddit has custom Toolbox Note labels, you must define a corresponding Native Note label for each of these custom Toolbox Mote labels: ",

    N2T_INVALID_PAIRS: "Invalid Syntax: ",
    N2T_INVALID_NATIVE_LABEL: "Invalid Native Note Labels:",
    N2T_INVALID_TOOLBOX_LABEL: "Invalid custom Toolbox Note Labels:",
    N2T_DUPLICATE_TOOLBOX_LABEL: "Duplicate Toolbox Note Labels:",
    N2T_MISSING_TOOLBOX_LABEL: "Undefined Toolbox Note Labels:",
};

export const DEFAULTS = {
    IGNORED_USERS: "ContextModBot",

    N2T_ENABLED: true,
    N2T_MAP_BOT_BAN: "botban",
    N2T_MAP_PERMA_BAN: "permban",
    N2T_MAP_BAN: "ban",
    N2T_MAP_ABUSE_WARNING: "abusewarn",
    N2T_MAP_SPAM_WARNING: "spamwarn",
    N2T_MAP_SPAM_WATCH: "spamwatch",
    N2T_MAP_SOLID_CONTRIBUTOR: "gooduser",
    N2T_MAP_HELPFUL_USER: "gooduser",
    N2T_MAP_NONE: "",

    T2N_ENABLED: true,
    T2N_MAP_BOTBAN: ["BOT_BAN"],
    T2N_MAP_PERMBAN: ["PERMA_BAN"],
    T2N_MAP_BAN: ["BAN"],
    T2N_MAP_ABUSEWARN: ["ABUSE_WARNING"],
    T2N_MAP_SPAMWARN: ["SPAM_WARNING"],
    T2N_MAP_SPAMWATCH: ["SPAM_WATCH"],
    T2N_MAP_GOODUSER: ["SOLID_CONTRIBUTOR"],
    T2N_MAP_NONE: ["HELPFUL_USER"],
    T2N_MAP_CUSTOM: "",
};

export const OPTIONS: Record<string, FieldConfig_Selection_Item[]> = {
    T2N_MAP: [
        {value: "BOT_BAN", label: "Bot Ban (BOT_BAN)"},
        {value: "PERMA_BAN", label: "Permanent Ban (PERMA_BAN)"},
        {value: "BAN", label: "Ban (BAN)"},
        {value: "ABUSE_WARNING", label: "Abuse Warning (ABUSE_WARNING)"},
        {value: "SPAM_WARNING", label: "Spam Warning (SPAM_WARNING)"},
        {value: "SPAM_WATCH", label: "Spam Watch (SPAM_WATCH)"},
        {value: "SOLID_CONTRIBUTOR", label: "Solid Contributor (SOLID_CONTRIBUTOR)"},
        {value: "HELPFUL_USER", label: "Helpful User (HELPFUL_USER)"},
    ],
};

export const KEYS = {
    IGNORED_USERS: "ignoredUsers",
    N2T_ENABLED: "n2tEnabled",
    T2N_ENABLED: "t2nEnabled",
    N2T_MAP_BOT_BAN: "n2tMapBotBan",
    N2T_MAP_PERMA_BAN: "n2tMapPermaBan",
    N2T_MAP_BAN: "n2tMapBan",
    N2T_MAP_ABUSE_WARNING: "n2tMapAbuseWarning",
    N2T_MAP_SPAM_WARNING: "n2tMapSpamWarning",
    N2T_MAP_SPAM_WATCH: "n2tMapSpamWatch",
    N2T_MAP_SOLID_CONTRIBUTOR: "n2tMapSolidContributor",
    N2T_MAP_HELPFUL_USER: "n2tMapHelpfulUser",
    N2T_MAP_NONE: "n2tMapNone",
    T2N_MAP_BOTBAN: "t2nMapBotban",
    T2N_MAP_PERMBAN: "t2nMapPermban",
    T2N_MAP_BAN: "t2nMapBan",
    T2N_MAP_ABUSEWARN: "t2nMapAbusewarn",
    T2N_MAP_SPAMWARN: "t2nMapSpamwarn",
    T2N_MAP_SPAMWATCH: "t2nMapSpamwatch",
    T2N_MAP_GOODUSER: "t2nMapGooduser",
    T2N_MAP_NONE: "t2nMapNone",
    T2N_MAP_CUSTOM: "t2nMapCustom",
};

export const N2T_KEY_MAP: Record<UserNoteLabel | "", string> = {
    "BOT_BAN": KEYS.N2T_MAP_BOT_BAN,
    "PERMA_BAN": KEYS.N2T_MAP_PERMA_BAN,
    "BAN": KEYS.N2T_MAP_BAN,
    "ABUSE_WARNING": KEYS.N2T_MAP_ABUSE_WARNING,
    "SPAM_WARNING": KEYS.N2T_MAP_SPAM_WARNING,
    "SPAM_WATCH": KEYS.N2T_MAP_SPAM_WATCH,
    "SOLID_CONTRIBUTOR": KEYS.N2T_MAP_SOLID_CONTRIBUTOR,
    "HELPFUL_USER": KEYS.N2T_MAP_HELPFUL_USER,
    "": KEYS.N2T_MAP_NONE,
};

export const T2N_KEY_MAP: Record<string, string> = {
    "gooduser": KEYS.T2N_MAP_GOODUSER,
    "spamwatch": KEYS.T2N_MAP_SPAMWATCH,
    "spamwarn": KEYS.T2N_MAP_SPAMWARN,
    "abusewarn": KEYS.T2N_MAP_ABUSEWARN,
    "ban": KEYS.T2N_MAP_BAN,
    "permban": KEYS.T2N_MAP_PERMBAN,
    "botban": KEYS.T2N_MAP_BOTBAN,
    "": KEYS.T2N_MAP_NONE,
};
