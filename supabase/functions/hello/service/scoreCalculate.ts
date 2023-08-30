// Calculate Gold and EXP Returns
// Code here will run once per input pageItem.

export function scoreCalculate(pageItem: NotionPageWin): void  {
    const currDate = new Date().toISOString().split('T')[0]
    if (!pageItem.do_date) {
        pageItem.do_date = currDate;
    }

    if (!pageItem.closing_date) {
        pageItem.closing_date = currDate;
    }

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    pageItem.punctuality = dateDiffInDays(new Date(pageItem.closing_date), new Date(pageItem.do_date));

    function dateDiffInDays(a: Date, b: Date): number {
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    if (pageItem.difficulty && (pageItem.type !== "Goal" || pageItem.type !== "Key Result" || pageItem.type !== "Project")) {
        if (Number(pageItem.difficulty) > 10) {
            pageItem.difficulty = 10;
        } else {
            pageItem.difficulty = Number(pageItem.difficulty);
        }
    } else {
        pageItem.difficulty = 1;
    }

    const modifier = Math.max(0, (Number(pageItem.difficulty) + (pageItem.punctuality * 0.05 * Number(pageItem.difficulty))));

    // Determine rewards
    if (pageItem.type == "Goal") {
        determineRewards(500, 0);
    } else if (pageItem.type == "Key Result") {
        determineRewards(250, 0);
    } else if (pageItem.type == "Project") {
        determineRewards(50, 50);
    } else if (pageItem.type == "Task") {
        determineRewards(25, 25);
    } else {
        determineRewards(25, 25);
    }

    function determineRewards(exp: number, gold: number): void {
        pageItem.exp_reward = Math.round(exp * pageItem.difficulty);
        pageItem.gold_reward = Math.round(gold * modifier);
        if (pageItem.gold_reward < (gold * pageItem.difficulty)) {
            pageItem.trend = "down";
        } else if (pageItem.gold_reward === (gold * pageItem.difficulty)) {
            pageItem.trend = "check";
        } else {
            pageItem.trend = "up";
        }
    }

    return pageItem;
}