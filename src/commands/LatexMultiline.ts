import {
    ChatInputCommandInteraction,
    ApplicationIntegrationType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder, InteractionContextType
} from "discord.js";

import Command from "@/handlers/commands/Command";

// noinspection JSUnusedGlobalSymbols
export default class LatexMultiline extends Command<ChatInputCommandInteraction> {
    constructor() {
        super({
            name: "latex-multiline",
            description: "Prompt a modal with a multiline LaTeX formula input",
            contexts: [
                InteractionContextType.PrivateChannel,
                InteractionContextType.BotDM,
                InteractionContextType.Guild
            ],
            integrationTypes: [
                ApplicationIntegrationType.UserInstall,
                ApplicationIntegrationType.GuildInstall
            ],
        }, []);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const formulaInput = new TextInputBuilder()
            .setCustomId("formula")
            .setLabel("LaTeX Formula")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder("e.g. \\frac{1}{2} \\times \\sqrt{3} = \\frac{\\sqrt{3}}{2}");

        const actionRow = new ActionRowBuilder<TextInputBuilder>()
            .setComponents(formulaInput);

        const modal = new ModalBuilder()
            .setTitle("Generate LaTeX Image")
            .setCustomId("latex-multiline")
            .setComponents(actionRow);

        await interaction.showModal(modal);
    }
}