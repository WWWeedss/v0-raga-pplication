export interface UserModel{
    // 这里用蛇形命名法是因为 Python 后端接口返回的字段是蛇形命名法
    user_id?: number,
    username?: string,
    password?: string,
}