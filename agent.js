/**
 * MILO AUTH AGENT v1.0
 * Professional Middleware for Private GitHub Data Retrieval
 */
const MiloAgent = {
    config: {
        token: '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',
        owner: 'com-org',
        repo: 'MILO',
        path: 'accounts.json'
    },

    /**
     * Searches the private repository for a matching user
     * @param {string} email - The email to search for
     * @param {string|null} password - If provided, validates the password
     */
    async search(email, password = null) {
        try {
            const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.path}`;
            
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `token ${this.config.token}`,
                    'Accept': 'application/vnd.github.v3+json' 
                }
            });

            if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

            const json = await response.json();
            
            // Decode the Base64 content provided by GitHub
            const decodedData = atob(json.content.replace(/\s/g, ''));
            const database = JSON.parse(decodedData);

            // Execute the search logic
            const user = database.accounts.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) return { success: false, message: "ACCOUNT_NOT_FOUND" };

            // If a password was passed, verify it
            if (password !== null) {
                if (user.password === password) {
                    return { success: true, user: user };
                } else {
                    return { success: false, message: "INVALID_PASSWORD" };
                }
            }

            // If no password was passed (Step 1), just return user existence
            return { success: true, user: user };

        } catch (error) {
            console.error("Agent Error:", error);
            return { success: false, message: "CONNECTION_ERROR" };
        }
    }
};
