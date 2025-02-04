const Api = {
    SIGN_IN: "http://localhost:3001/users/login",
    SIGN_UP: "http://localhost:3001/users/register", 
    SUBMIT_QUIZ: "http://localhost:3001/quiz/submit",
    FORGOT_PASSWORD: "http://localhost:3001/users/forgot-password",
    VERIFY_OTP:"http://localhost:3001/users/verify-otp",
    SERVER_URL:"http://localhost:3001",
    COMMUNITY_URL:"http://localhost:3001/communities/view",
    CHECK_EMAIL:"http://localhost:3001/users/email",
    CHECK_USERNAME:"http://localhost:3001/users/username",
    COMMUNITY_GET_URL:"http://localhost:3001/communities/viewAll",
    CREATE_GROUP:"http://localhost:3001/groups/create",
    ADMIN_LOGIN:"http://localhost:3001/admin/login",
    GET_POST_EXCEPT_USER:"http://localhost:3001/posts/all-posts",
    GET_COMMUNITY_POST:"http://localhost:3001/posts/getCommunityPosts",
    GET_USER_POST:"http://localhost:3001/posts/getUserPosts",
    GET_DAILY_CHALLENGE:"http://localhost:3001/challenge/daily-challenge",
    SEND_NOTIFICATION:"http://localhost:3001/notifications/notifications",
    BASIC_POST_ROUTE:"http://localhost:3001/posts/posts",
    ADD_COMMENT:"http://localhost:3001/comments/addComment",
    GET_COMMUNITY_USERS:"http://localhost:3001/users/get-community-users",
};

export default Api;