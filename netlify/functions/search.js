exports.handler = async (event) => {
    try {
        let cityKey = "";

        if (event.body) {
            const bodyStr = event.body;
            const pairs = bodyStr.split('&');
            for (let pair of pairs) {
                const [key, value] = pair.split('=');
                if (key === 'city_key') {
                    cityKey = decodeURIComponent(value || "");
                    break;
                }
            }
        }

        const digit = cityKey.replace(/\D/g, '').charAt(0);

        // אם זוהה מקש, נחזיר פקודת read פשוטה מאוד
        if (digit) {
            const textToSay = `הקשת את המקש ${digit} התקשורת עובדת`;
            // מבנה: read=t-[טקסט]=[שם פרמטר],[האם להגיד מספר],1,1,1,Digits
            const response = `read=t-${textToSay}=selected_city,no,1,1,1,Digits`;

            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: response
            };
        }

        // אם לא זוהה מקש
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-נא להקיש שוב=city_key,no,1,1,1,Digits"
        };

    } catch (error) {
        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: "read=t-תקלה בשרת=city_key,no,1,1,1,Digits"
        };
    }
};
