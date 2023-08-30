export interface NotionPageWin {
    name: string,
    impact: string,
    source: string,
    type: string;
    do_date: string;
    closing_date: string | Date;
    upstream: string;
    area: string;
    upstream_id: string | null;
    difficulty: number;
    punctuality?: number;
    exp_reward?: number;
    gold_reward?: number;
    trend?: string;
}