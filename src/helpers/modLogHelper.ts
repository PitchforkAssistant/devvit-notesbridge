import {ModAction, ModActionType, RedditAPIClient} from "@devvit/public-api";

export async function getModlogEntry (reddit: RedditAPIClient, subredditName: string, moderatorName: string, action: ModActionType, actionedAt: Date, tolerance: number = 1000): Promise<ModAction | undefined> {
    let currentPage = reddit.getModerationLog({
        subredditName,
        moderatorUsernames: [moderatorName],
        type: action,
        pageSize: 100,
    });
    let foundAction: ModAction | undefined;
    outer: while (!foundAction) {
        // Get the entries on the current page
        const results = await currentPage.get(100);
        for (const result of results) {
            // result.createdAt has a precision of 1 second, but actionedAt has a precision of 1 millisecond
            if (Math.abs(result.createdAt.getTime() - actionedAt.getTime()) < tolerance) {
                // Found the action, stop searching
                foundAction = result;
                break outer;
            }
        }

        if (!currentPage.hasMore || results.length < 1) {
            // No more pages to check
            break;
        }

        // Go to next page
        currentPage = reddit.getModerationLog({
            subredditName,
            moderatorUsernames: [moderatorName],
            type: action,
            pageSize: 100,
            after: results[results.length - 1].id,
        });
    }

    return foundAction;
}
