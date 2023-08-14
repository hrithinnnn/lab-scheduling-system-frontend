
work for the intern:

performance fixes:
 13. handle uncaught errors when no network connection (do this last)
 12. lab details - layout, timetable, hardware & software config, budget, faculty, lab assistant
 17. dropdown for subs,sem,class,section. show subs based on the sem chosen. 
 19. summary page konjam hardcoded. change it if possible.
 20. all labs in check availability
 21. usecontext for getuser and gettoken and pass them down to all the components. 
 22. format time and date in email.
 23. dont reload page everytime i submitted form, clear each field manually after submit.
 24. validate dates and times in all forms and ensure it is not in the past in every form.
 26. date is stored 1 day lesser in mongo
 27. use json for forms like my loginpage
 28. close hod and lab prompts after sending mail.
 29. open snackbar using ref instead of passing true as props.
 30. add key as props in all the places where i used map function to display a json.

 css fixes:
 1. date,timepickers css, inputfield(desc).
 2. ssn logo on nav
 11. css for reqs and labs in home.
 18. css- fix hamburger, get a dropdown from mui, make forms like login page,css and placements for buttons on page like check availablility, delete and update profile.

my notes:
cant edit date, time, lab of events.
cant edit lab classes.
users cant edit email.
i show rejected,pending reqs in search, only approved by both and labs in home.

before submitting: refactor code, rename vars, add auths to reqs, document everything