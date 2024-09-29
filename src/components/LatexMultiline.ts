import Component from "@/handlers/components/Component";

import { ComponentType, ModalSubmitInteraction } from "discord.js";
import Latex, { LATEX_RENDER_URL, LatexFontSize } from "@/commands/Latex";

// noinspection JSUnusedGlobalSymbols
export default class LatexMultiline extends Component {
    constructor() {
        super("latex-multiline");
    }

    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        const formula = interaction.fields.getField("formula", ComponentType.TextInput).value;
        const fontSize = Latex.mapSize(LatexFontSize.Large);

        const styledFormula = `${fontSize} ${formula}`;
        const encodedFormula = encodeURIComponent(styledFormula);

        await interaction.reply(LATEX_RENDER_URL + encodedFormula);
    }
}