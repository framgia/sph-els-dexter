export enum EEndpoints {
  /** User */
  REGISTER_USER = "/create",
  LOGIN = "/login",
  LOGOUT = "/logout",
  AUDIT_LOGS = "/auditlog",
  SOCIAL = "/social",

  /** Quiz */
  ADD_CATEGORY = "/quiz/category",
  ADD_WORD = "/quiz/word",
  WORD_LIST = "/quiz/words/list",
  CATEGORY_LIST = "/quiz/category/list",
  ADD_CATEGORY_WORD = "/quiz/category/word",
  GET_WORD_DATA = "/quiz/words/data",
  UPDATE_CATEGORY = "/quiz/category/edit",
  DELETE_CATEGORY = "/quiz/category/delete",
  START_QUIZ = "/quiz/start",
  ANSWER_QUIZ = "/quiz/answer",
  FETCH_RESULT = "/quiz/result"
}
