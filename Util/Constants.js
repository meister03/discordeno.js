exports.permissionOverwritesTypes = {
    'role': 0,
    'member': 1,
};

exports.Colors = {
    DEFAULT: 0x000000,
    AQUA: 0x1abc9c,
    WHITE: 0xffffff,
    BLUE: 0x3498db,
    GREEN: 0x57f287,
    PURPLE: 0x9b59b6,
    YELLOW: 0xfee75c,
    ORANGE: 0xe67e22,
    GOLD: 0xf1c40f,
    NAVY: 0x34495e,
    RED: 0xed4245,
    GREY: 0x95a5a6,
    GREYPLE: 0x99aab5,
    BLURPLE: 0x5865f2,
}

exports.DISCORD_EPOCH = 1_420_070_400_000;

exports.INTERACTIONS = {
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
    CHANNEL_MESSAGE_WITH_SOURCE: 4,
    DEFERRED_UPDATE_MESSAGE: 6,
    UPDATE_MESSAGE: 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8,
    MODAL: 9,
    FLAGS: { EPHEMERAL: 64 },
    INTERACTION_TYPES: {
        CHAT_INPUT: 1,
        APPLICATION_COMMAND: 2,
        CONTEXT_MENU: 2,
        MESSAGE_COMPONENT: 3,
        APPLICATION_COMMAND_AUTOCOMPLETE: 4,
    }
};

exports.ACTIVITIES = {
    PLAYING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    CUSTOM: 4,
    COMPETETING: 5,
}
