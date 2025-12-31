exports.handler = async (event) => {
    try {
        // לוג בסיסי כדי שנראה ב-Netlify שהפונקציה עלתה
        console.log("Function started. Body:", event.body);

        let cityKey = "";
        
        // שליפת הנתון בצורה הכי ידנית שיש
        if (event.body) {
            const params = new URLSearchParams(event.body);
            cityKey = params.get('city_key') || "";
        }

        const digit = cityKey.toString().replace(/\D/g, '').charAt(0);

        // תגובה קבועה ופשוטה רק כדי לבדוק שה-502 נעלם
        if (digit === "2") {
            return {
                statusCode: 200,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
                body: "read=t-הקשת שתיים. עכשיו זה עובד=selected_city,no,1,1,1,Digits"
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: `read=t-הקשת ${digit || "כלום"}. נא הקש שוב=city_key,no,1,1,1,Digits`
        };

    } catch (error) {
        console.error("Error details:", error);
        return {
            statusCode: 200, // תמיד מחזירים 200 לימות המשיח
            body: "read=t-שגיאה פנימית בשרת=city_key,no,1,1,1,Digits"
        };
    }
};
