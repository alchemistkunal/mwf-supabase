// Calculate Gold and EXP Returns
// Code here will run once per input pageItem.
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export function scoreCalculate(pageItem: NotionPageWin): void  {
    const currDate = new Date().toISOString().split('T')[0]
    if (!pageItem.do_date) {
        pageItem.do_date = currDate;
    }

    if (!pageItem.closing_date) {
        pageItem.closing_date = currDate;
    }

    pageItem.punctuality = dateDiffInDays(new Date(pageItem.closing_date), new Date(pageItem.do_date));

    if (pageItem.difficulty && (pageItem.type !== "Goal" || pageItem.type !== "Key Result" || pageItem.type !== "Project")) {
        if (Number(pageItem.difficulty) > 10) {
            pageItem.difficulty = 10;
        } else {
            pageItem.difficulty = Number(pageItem.difficulty);
        }
    } else {
        pageItem.difficulty = 1;
    }


    // Determine rewards
    if (pageItem.type == "Goal") {
        determineRewards(pageItem, 500, 0);
    } else if (pageItem.type == "Key Result") {
        determineRewards(pageItem, 250, 0);
    } else if (pageItem.type == "Project") {
        determineRewards(pageItem, 50, 50);
    } else if (pageItem.type == "Task") {
        determineRewards(pageItem, 25, 25);
    } else {
        determineRewards(pageItem, 25, 25);
    }
}

function dateDiffInDays(a: Date, b: Date): number {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function determineRewards(pageItem: NotionPageWin, exp: number, gold: number): void {
    const modifier = Math.max(0, (Number(pageItem.difficulty) + (pageItem.punctuality * 0.05 * Number(pageItem.difficulty))));

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