# Task Manager
task manager apis built in nodejs
This repo contains task manager application build in nodeJS.
It has maninly following apis ->

**1. /tasks (get)** : fetch all tasks from tasks.json file. It also has a filter feature which you have to send like /tasks/?filter=title&filterVal=Task1

**2. /tasks/:id (get)** : reading single task based on taskId

**3. /tasks (post)** : create task with following payload 
  
**Payload = { "id" : 1
     "title" : "Task1", 
     "description" : "Task1 has description",
     "completion_status": false,
     "priority":low,
     "creation_date": "23-11-2023"
     }**

**4. /tasks/:id (put)** : update specific task with same payload mentioned above

**5 /tasks/:id (delete)** : delete specific task

**6 /tasks/priority/:level (get)** : retrieve tasks based on priority level ex. low, high, medium

