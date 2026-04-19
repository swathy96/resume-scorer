import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

async function main() {
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: "Say hello in exactly 3 words." }]
});
    console.log(response);
}
main().catch(console.error);