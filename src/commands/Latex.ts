import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ApplicationIntegrationType,
    ApplicationCommandOptionChoiceData,
    InteractionContextType,
    PermissionFlagsBits
} from "discord.js";

import Command from "@/handlers/commands/Command";

// noinspection JSUnusedGlobalSymbols
enum LatexColor {
    Amber = "FFBF00",
    Amethyst = "9966CC",
    Black = "000000",
    Blue = "0000FF",
    Brown = "964B00",
    Coral = "FF7F50",
    Crimson = "DC143C",
    Cyan = "00FFFF",
    Emerald = "50C878",
    Gold = "FFD700",
    Gray = "808080",
    Green = "008000",
    Lime = "BFFF00",
    Magenta = "FF00FF",
    Maroon = "800000",
    Olive = "808000",
    Orange = "FF6600",
    Peach = "FFE5B4",
    Pink = "FD6C9E",
    Purple = "800080",
    Red = "FF0000",
    Teal = "008080",
    Violet = "7F00FF",
    White = "FFFFFF",
    Yellow = "FFFF00"
}

export const LATEX_RENDER_URL = "https://latex.codecogs.com/png.image?";
const mappedColorChoices: ApplicationCommandOptionChoiceData<LatexColor>[] = Object.keys(LatexColor).map(color => {
    // @ts-ignore
    const hex: LatexColor = LatexColor[color];

    return {
        name: `${color} - #${hex}`,
        value: hex
    };
});

// noinspection JSUnusedGlobalSymbols
export default class Latex extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "latex",
            description: "Generate a LaTeX image",
            contexts: [
                InteractionContextType.PrivateChannel,
                InteractionContextType.BotDM,
                InteractionContextType.Guild
            ],
            integrationTypes: [
                ApplicationIntegrationType.UserInstall,
                ApplicationIntegrationType.GuildInstall
            ],
            options: [
                {
                    name: "formula",
                    description: "The LaTeX formula to render",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "size",
                    description: "The size of the text (large by default)",
                    type: ApplicationCommandOptionType.Integer,
                    choices: [
                        {
                            name: "Tiny",
                            value: LatexFontSize.Tiny,
                        },
                        {
                            name: "Small",
                            value: LatexFontSize.Small,
                        },
                        {
                            name: "Large",
                            value: LatexFontSize.Large,
                        },
                        {
                            name: "Extra Large",
                            value: LatexFontSize.ExtraLarge,
                        },
                        {
                            name: "Huge",
                            value: LatexFontSize.Huge,
                        },
                    ]
                },
                {
                    name: "background_color",
                    description: "The background color of the image (none by default)",
                    type: ApplicationCommandOptionType.String,
                    choices: mappedColorChoices
                },
                {
                    name: "text_color",
                    description: "The text color of the image (black by default)",
                    type: ApplicationCommandOptionType.String,
                    choices: mappedColorChoices
                }
            ]
        }, []);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!canClientEmbed(interaction)) {
            await interaction.reply({
                content: "I need the `Embed Links` permission to generate LaTeX images.",
                ephemeral: true
            });
            return;
        }

        const formula = interaction.options.getString("formula", true);
        const backgroundColor = interaction.options.getString("background_color");
        const textColor = interaction.options.getString("text_color") ?? LatexColor.Black;
        const size: LatexFontSize = interaction.options.getInteger("size") ?? LatexFontSize.Large;
        const strSize = Latex.mapSize(size);

        let styleFormula = `${strSize}\\fg{${textColor}}`;

        if (backgroundColor) {
            styleFormula += `\\bg{${backgroundColor}}`;
        }

        const encodedFormula = encodeURIComponent(styleFormula + formula);
        await interaction.reply(LATEX_RENDER_URL + encodedFormula);
    }

    static mapSize(size: LatexFontSize): string {
        switch (size) {
            case LatexFontSize.Tiny:
                return "\\tiny";
            case LatexFontSize.Small:
                return "\\small";
            case LatexFontSize.Large:
                return "\\large";
            case LatexFontSize.ExtraLarge:
                return "\\LARGE";
            case LatexFontSize.Huge:
                return "\\huge";
        }
    }
}

export function canClientEmbed(interaction: ChatInputCommandInteraction): boolean {
    if (!interaction.inCachedGuild()) return true;
    if (!interaction.channel!.isTextBased()) return false;
    if (!interaction.guild.members.me) return false;

    const permissions = interaction.channel.permissionsFor(interaction.guild.members.me);
    return permissions.has(PermissionFlagsBits.EmbedLinks);
}

export enum LatexFontSize {
    Tiny,
    Small,
    Large,
    ExtraLarge,
    Huge
}
