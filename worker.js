export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const WORKER_URL = url.origin;
    const DEFAULT_REACTION_BIG = true;

    const REACTIONS = [
      "⭐","❤","👍","👎","🔥","🥰","👏","😁","🤔","🤯","😱","🤬","😢","🎉","🤩",
      "🤮","🙏","👌","🕊","🤡","🥱","🥴","😍","🐳","❤‍🔥","🌚","🌭","💯",
      "⚡","🍌","🏆","💔","🤨","😐","🍓","🍾","💋","🖕","😈","😴","😭","🤓","👻",
      "👨‍💻","👀","🎃","🙈","😇","😨","🤝","✍","🤗","🫡","🎅","🎄","☃","💅","🤪",
      "🗿","🆒","💘","🙉","🦄","😘","💊","🙊","😎","👾","🤷‍♂","🤷","🤷‍♀","😡"
    ];

    const SAFE_REACTIONS = ["👍", "❤", "🔥", "🎉", "👏", "😁"];

    const START_PHOTO = "https://i.postimg.cc/L5PHrvJZ/baeef47e-a091-423e-a2ee-32f1382a4ded.png";
    const UPDATES_URL = "https://t.me/BlueOrbitDevs";
    const SUPPORT_URL = "https://t.me/Thamaraiselvi69";

    const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomReaction = () => randomFrom(REACTIONS);

    const isChannelStyleMessage = (chatType, msg) => {
      return Boolean(
        chatType === "channel" ||
        msg?.sender_chat ||
        msg?.is_automatic_forward
      );
    };

    const pickReaction = (chatType, msg) => {
      if (isChannelStyleMessage(chatType, msg)) {
        return randomFrom(SAFE_REACTIONS);
      }
      return randomReaction();
    };

    const getBotToken = (request, env) => {
      try {
        const u = new URL(request.url);
        const fromQuery = u.searchParams.get("token");
        if (fromQuery) return String(fromQuery).trim();
      } catch {}

      const fromHeader =
        request.headers.get("X-BOT-TOKEN") ||
        request.headers.get("x-bot-token");

      if (fromHeader) return String(fromHeader).trim();
      if (env && env.BOT_TOKEN) return String(env.BOT_TOKEN).trim();

      return null;
    };

    const isValidTokenFormat = (t) =>
      /^\d+:[A-Za-z0-9\-_]+$/.test(String(t || ""));

    const escapeHtml = (text = "") =>
      String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const html = (baseUrl) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Webhook Manager</title>
    <meta name="keywords" content="Telegram Webhook Manager, Telegram Bot API, setWebhook, Telegram bot webhook tool, bot token webhook, Telegram API manager, webhook configuration, Telegram developer tool, Telegram bot automation">
    <meta property="og:title" content="Telegram Webhook Manager">
    <meta property="og:description" content="Easily set and manage your Telegram bot webhook using a simple and secure interface. Configure your Bot API webhook instantly.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}">
    <link rel="icon" type="image/png" href="https://web.telegram.org/k/assets/img/favicon-32x32.png?v=jw3mK7G9Ry">
    <meta property="og:image" content="https://www.cyclic.sh/content/telegrambot.banner.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root {
            --tg-blue: #0088cc;
            --tg-bg: #54a9eb;
        }

        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--tg-bg);
            background-image: url("https://telegram.org/img/tgme/pattern.svg?1");
            background-attachment: fixed;
            background-size: 450px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        }

        .card {
            background: #fff;
            width: 100%;
            max-width: 400px;
            padding: 35px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25);
            text-align: center;
            box-sizing: border-box;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .icon-circle {
            width: 72px;
            height: 72px;
            background: var(--tg-blue);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 25px;
            color: white;
            font-size: 32px;
            box-shadow: 0 10px 20px rgba(0, 136, 204, 0.3);
        }

        h2 {
            margin: 0 0 10px;
            color: #222;
            font-size: 26px;
            font-weight: 800;
        }

        p.subtitle {
            color: #777;
            font-size: 14px;
            margin-bottom: 35px;
        }

        .input-group {
            position: relative;
            margin-bottom: 20px;
            text-align: left;
        }

        .input-label {
            display: block;
            font-size: 11px;
            font-weight: 800;
            color: #bbb;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            margin-left: 4px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-wrapper input {
            width: 100%;
            padding: 16px 90px 16px 48px;
            border-radius: 14px;
            border: 2px solid #f0f0f0;
            background: #f9f9f9;
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s;
            color: #333;
        }

        .input-wrapper input:focus {
            background: #fff;
            border-color: var(--tg-blue);
            box-shadow: 0 0 0 4px rgba(0, 136, 204, 0.1);
        }

        .left-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: #aaa;
            font-size: 18px;
        }

        .action-btns {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 4px;
        }

        .action-btn {
            border: none;
            background: none;
            cursor: pointer;
            color: #aaa;
            padding: 8px;
            font-size: 18px;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .action-btn:hover {
            color: var(--tg-blue);
            background: rgba(0, 136, 204, 0.05);
        }

        .main-btn {
            width: 100%;
            padding: 16px;
            border: none;
            border-radius: 14px;
            background: var(--tg-blue);
            color: white;
            font-size: 17px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            box-shadow: 0 8px 15px rgba(0, 136, 204, 0.2);
        }

        .main-btn:hover {
            background: #0077b5;
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(0, 136, 204, 0.3);
        }

        .main-btn:active { transform: scale(0.98); }

        .result {
            margin-top: 25px;
            font-size: 13px;
            padding: 18px;
            border-radius: 14px;
            display: none;
            word-break: break-all;
            text-align: left;
            line-height: 1.5;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .success { background: #f0fff4; color: #276749; border: 1px solid #c6f6d5; }
        .error { background: #fff5f5; color: #9b2c2c; border: 1px solid #fed7d7; }

        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(6px);
            display: none;
            justify-content: center;
            align-items: center;
            padding: 20px;
            z-index: 1000;
        }

        .modal {
            background: #fff;
            width: 100%;
            max-width: 340px;
            padding: 30px;
            border-radius: 24px;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
            animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPop {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .modal i.fa-question-circle {
            font-size: 56px;
            color: var(--tg-blue);
            margin-bottom: 20px;
        }

        .modal h3 { margin: 0 0 10px; font-size: 20px; }
        .modal p { color: #666; font-size: 15px; margin-bottom: 30px; line-height: 1.5; }

        .modal-btns { display: flex; gap: 12px; }
        .modal-btns button {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.2s;
        }

        .cancel-btn { background: #f5f5f5; color: #444; }
        .cancel-btn:hover { background: #eee; }
        .confirm-btn { background: var(--tg-blue); color: white; }
        .confirm-btn:hover { background: #0077b5; }
    </style>
</head>
<body>

<div class="card">
    <div class="icon-circle">
        <i class="fa fa-paper-plane"></i>
    </div>
    <h2>Clone Bot</h2>
    <p class="subtitle">Set your Telegram Reaction Bot instantly</p>

    <div class="input-group">
        <label class="input-label">Bot Token</label>
        <div class="input-wrapper">
            <i class="fa fa-key left-icon"></i>
            <input type="password" id="token" placeholder="Enter Bot Token">
            <div class="action-btns">
                <button class="action-btn" onclick="pasteToken()" title="Paste">
                    <i class="fa fa-paste"></i>
                </button>
                <button class="action-btn" onclick="toggleToken()" title="Show/Hide">
                    <i class="fa fa-eye" id="eyeIcon"></i>
                </button>
            </div>
        </div>
    </div>

    <button class="main-btn" onclick="showConfirm()">
        <i class="fa fa-link"></i> Clone Bot
    </button>

    <div id="result" class="result"></div>
</div>

<div id="modalOverlay" class="modal-overlay">
    <div class="modal">
        <i class="fa fa-question-circle"></i>
        <h3>Confirm Action</h3>
        <p>Are you sure you want to clone this bot? This will set webhook, menu mini app, command and description.</p>
        <div class="modal-btns">
            <button class="cancel-btn" onclick="closeModal()">Cancel</button>
            <button class="confirm-btn" onclick="performActions
();">Confirm</button>
        </div>
    </div>
</div>

<script>
    const WORKER_URL = ${JSON.stringify(baseUrl)};

    function pasteToken() {
        navigator.clipboard.readText().then(text => {
            document.getElementById("token").value = text.trim();
        }).catch(() => alert("Please allow clipboard access."));
    }

    function toggleToken() {
        const input = document.getElementById("token");
        const icon = document.getElementById("eyeIcon");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    }

    function showConfirm() {
        const token = document.getElementById("token").value.trim();
        if (!token) {
            alert("Please enter a bot token first.");
            return;
        }
        document.getElementById("modalOverlay").style.display = "flex";
    }

    function closeModal() {
        document.getElementById("modalOverlay").style.display = "none";
    }

    async function performActions() {
        closeModal();
        const token = document.getElementById("token").value.trim();
        const resultBox = document.getElementById("result");

        resultBox.style.display = "block";
        resultBox.className = "result";
        resultBox.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';

        try {
            const webhookRes = await fetch(\`https://api.telegram.org/bot\${token}/setWebhook?url=\${encodeURIComponent(WORKER_URL + "?token=" + token)}\`);
            const webhookData = await webhookRes.json();
            if (!webhookData.ok) {
                throw new Error("Webhook Error: " + (webhookData.description || JSON.stringify(webhookData)));
            }

            const meRes = await fetch(\`https://api.telegram.org/bot\${token}/getMe\`);
            const meData = await meRes.json();
            if (!meData.ok || !meData.result || !meData.result.username) {
                throw new Error("getMe Error: " + (meData.description || "Unable to fetch bot username"));
            }

            const botUsername = meData.result.username;

            const menuRes = await fetch(\`https://api.telegram.org/bot\${token}/setChatMenuButton\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    menu_button: {
                        type: "web_app",
                        text: "Clone Bot",
                        web_app: { url: WORKER_URL }
                    }
                })
            });
            const menuData = await menuRes.json();
            if (!menuData.ok) {
                throw new Error("Menu Button Error: " + (menuData.description || JSON.stringify(menuData)));
            }

            const commandsRes = await fetch(\`https://api.telegram.org/bot\${token}/setMyCommands\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commands: [
                        {
                            command: "start",
                            description: "🌸 sᴛᴀʀᴛ ᴛʜᴇ ʙᴏᴛ"
                        }
                    ]
                })
            });
            const commandsData = await commandsRes.json();
            if (!commandsData.ok) {
                throw new Error("Commands Error: " + (commandsData.description || JSON.stringify(commandsData)));
            }

            const aboutRes = await fetch(\`https://api.telegram.org/bot\${token}/setMyDescription\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: ""
                })
            });
            const aboutData = await aboutRes.json();
            if (!aboutData.ok) {
                throw new Error("About Error: " + (aboutData.description || JSON.stringify(aboutData)));
            }

            const shortRes = await fetch(\`https://api.telegram.org/bot\${token}/setMyShortDescription\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    short_description: "The World Is Merciless, And It's Also Very Beautiful."
                })
            });
            const shortData = await shortRes.json();
            if (!shortData.ok) {
                throw new Error("Short Description Error: " + (shortData.description || JSON.stringify(shortData)));
            }

            resultBox.className = "result success";
            resultBox.innerHTML = '<strong><i class="fa fa-check-circle"></i> Success!</strong><br>Webhook, menu mini app, command and description updated.<br><br><b>Bot Username:</b> @' + botUsername;
        } catch (error) {
            resultBox.className = "result error";
            resultBox.innerHTML = '<strong><i class="fa fa-times-circle"></i> Error</strong><br>' + error.message;
        }
    }
</script>

</body>
</html>`;

    if (request.method === "GET") {
      return new Response(html(WORKER_URL), {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const BOT_TOKEN = getBotToken(request, env);

    if (!BOT_TOKEN) {
      return new Response("No bot token provided", { status: 400 });
    }

    if (!isValidTokenFormat(BOT_TOKEN)) {
      return new Response("Invalid bot token format", { status: 400 });
    }

    const tg = async (method, body) => {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return await res.json().catch(() => null);
    };

    const getMe = async () => {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
      return await res.json().catch(() => null);
    };

    try {
      const update = await request.json().catch(() => null);
      if (!update) {
        return new Response("Invalid JSON", { status: 400 });
      }

      const msg = update.message || update.channel_post;
      if (!msg) {
        return new Response("OK");
      }

      const chatId = msg.chat?.id;
      const messageId = msg.message_id;
      const chatType = msg.chat?.type || "";
      const text = msg.text || msg.caption || "";

      if (!chatId || !messageId) {
        return new Response("OK");
      }

      if (!["private", "group", "supergroup", "channel"].includes(chatType)) {
        return new Response("OK");
      }

      if (text === "/start" && chatType === "private") {
        const me = await getMe();
        const botUsername = me?.ok && me?.result?.username ? me.result.username : null;
        const safeName = escapeHtml(msg.from?.first_name || "User");

        const startCaption = `
👋 <b>Welcome</b> <a href="tg://user?id=${msg.from?.id || chatId}">${safeName}</a> to <b>Random Reaction Bot</b>! 🎉

I react with <b>random emoji</b> on new messages automatically.

<blockquote><b>Why This Bot Is Best</b>
• Random emoji reactions
• Works in private chats
• Supports groups & supergroups
• Channel reaction support
• Easy clone bot feature
• 24/7 active</blockquote>

<b>Add me to your group and see the magic ✨</b>
        `.trim();

        const buttons = [];

        if (botUsername) {
          buttons.push([
            {
              text: "➕ Add Me",
              url: `https://t.me/${botUsername}?startgroup=true`
            }
          ]);
        }

        buttons.push([
          {
            text: "📢 Bot Updates",
            url: UPDATES_URL
          },
          {
            text: "💬 Bot Support",
            url: SUPPORT_URL
          }
        ]);

        buttons.push([
          {
            text: "🚀 Clone Bot",
            web_app: { url: WORKER_URL }
          }
        ]);

        await tg("sendPhoto", {
          chat_id: chatId,
          photo: START_PHOTO,
          caption: startCaption,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: buttons
          }
        }).catch(() => {});

        return new Response("OK");
      }

      // Explicitly treat "forwarded from channel in group/supergroup" as channel-style
      const isForwardFromChannelInGroup =
        (chatType === "group" || chatType === "supergroup") &&
        (msg.forward_from_chat?.type === "channel" || msg.is_automatic_forward);

      const channelLike = isChannelStyleMessage(chatType, msg) || isForwardFromChannelInGroup;

      // Skip other bots only in non-channel-like contexts
      if (msg.from?.is_bot && !channelLike) {
        return new Response("OK");
      }

      const emoji = pickReaction(chatType, msg);

      let reactionRes = await tg("setMessageReaction", {
        chat_id: chatId,
        message_id: messageId,
        reaction: [
          {
            type: "emoji",
            emoji
          }
        ],
        is_big: DEFAULT_REACTION_BIG
      });

      // Fallback: if channel-like and first reaction fails, try 👍
      if (!reactionRes?.ok && channelLike) {
        reactionRes = await tg("setMessageReaction", {
          chat_id: chatId,
          message_id: messageId,
          reaction: [
            {
              type: "emoji",
              emoji: "👍"
            }
          ],
          is_big: DEFAULT_REACTION_BIG
        });
      }

      return new Response("OK");
    } catch {
      return new Response("Error", { status: 500 });
    }
  }
};
