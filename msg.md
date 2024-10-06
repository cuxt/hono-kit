title：选填，消息的标题，受消息通道限制，某些通道可能忽略此字段。
desc：必填，消息的描述内容，也可称为 desp。
content：选填，支持部分 Markdown 语法的内容，视推送方式而定。
channel：选填，消息推送的通道（如 email, corp, lark 等）。
token：必填，用于身份验证的推送 token，可通过查询参数或 HTTP Authorization 头部传递。
url：选填，如果提供则作为消息的详细链接，不填时系统自动生成。
to：选填，指定推送接收的用户（如 user1|user2 或 @all）。