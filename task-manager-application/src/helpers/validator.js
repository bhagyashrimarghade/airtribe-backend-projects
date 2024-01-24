class validator {
  static validateTaskInfo(taskInfo, tasks) {
    let valueFound = tasks.some((val) => val.id == taskInfo.id);
    if (valueFound) return false;
    return true;
  }

  static validateFields(fields) {
    if (!fields == "" || fields == null) return true;
    return false;
  }

  static validateCompletionStatus(completionStatus) {
    if (typeof completionStatus == "boolean") return true;
    return false;
  }
}
module.exports = validator;
