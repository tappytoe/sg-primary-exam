(() => {
  const $ = (selector) => document.querySelector(selector);
  const storeKey = "tappytoe-primary-quest-v1";
  const defaultProgress = () => ({answered:0,correct:0,stars:0,seen:[]});
  let progress = defaultProgress();
  try { progress = {...defaultProgress(), ...JSON.parse(localStorage.getItem(storeKey) || "{}")}; } catch (_) {}
  let grade = 3, quizQuestions = [], questionIndex = 0, chosen = null, locked = false, sessionCorrect = 0, sessionStars = 0, lastQuestions = [];
  const modal = $("#quiz-modal");

  function save(){ try{localStorage.setItem(storeKey,JSON.stringify(progress));}catch(_){} updateStats(); }
  function updateStats(){
    $("#stat-answered").textContent = progress.answered;
    $("#stat-correct").textContent = progress.correct;
    $("#stat-stars").textContent = progress.stars;
  }
  function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
  function chooseGrade(value){
    grade = Number(value);
    document.querySelectorAll(".grade-card").forEach(card=>{const active=Number(card.dataset.grade)===grade;card.classList.toggle("selected",active);card.setAttribute("aria-pressed",String(active));});
    $("#quiz-grade").textContent = "PRIMARY " + grade;
    $("#math-topic-count").textContent = (window.PRIMARY_QUESTIONS||[]).filter(q=>q.grade===grade).length/2 + " topics · P" + grade;
  }
  function openQuiz(){
    const all=(window.PRIMARY_QUESTIONS||[]).filter(q=>q.grade===grade);
    if(!all.length){showToast("More quests are on the way!");return;}
    const fresh=shuffle(all.filter(q=>!progress.seen.includes(q.id)));
    quizQuestions=shuffle(fresh.length>=Math.min(5,all.length)?fresh:all).slice(0,Math.min(5,all.length));
    lastQuestions=quizQuestions;
    questionIndex=0;sessionCorrect=0;sessionStars=0;chosen=null;locked=false;
    $("#quiz-stage").hidden=false;$("#results-stage").hidden=true;
    $("#quiz-instructions").textContent="Choose the best answer. You can take your time.";
    modal.hidden=false;document.body.style.overflow="hidden";renderQuestion();
    $("#close-quiz").focus();
  }
  function renderQuestion(){
    const q=quizQuestions[questionIndex];chosen=null;locked=false;
    $("#quiz-progress-text").textContent=(questionIndex+1)+" OF "+quizQuestions.length;
    $("#quiz-progress-fill").style.width=(questionIndex/quizQuestions.length*100)+"%";
    $("#question-topic").textContent=q.topic.toUpperCase();
    $("#question-text").textContent=q.question;
    $("#feedback").hidden=true;$("#feedback").className="feedback";
    $("#next-question").disabled=true;$("#next-question").innerHTML='Check answer <span>→</span>';
    const grid=$("#answer-grid");grid.innerHTML="";
    q.answers.forEach((answer,index)=>{
      const button=document.createElement("button");button.type="button";button.className="answer-option";button.dataset.index=index;
      const letter=document.createElement("span");letter.className="option-letter";letter.textContent=String.fromCharCode(65+index);
      const text=document.createElement("span");text.textContent=answer;
      button.append(letter,text);button.addEventListener("click",()=>selectAnswer(index));grid.append(button);
    });
    $("#question-text").focus?.();
  }
  function selectAnswer(index){
    if(locked)return;chosen=index;
    document.querySelectorAll(".answer-option").forEach(button=>{button.classList.toggle("chosen",Number(button.dataset.index)===index);});
    $("#next-question").disabled=false;$("#next-question").textContent="Check answer";
    $("#next-question").onclick=checkAnswer;
  }
  function checkAnswer(){
    if(locked||chosen===null)return;
    locked=true;const q=quizQuestions[questionIndex],correct=chosen===q.correct;
    progress.answered++;progress.seen=[...new Set([...progress.seen,q.id])];
    if(correct){progress.correct++;progress.stars++;sessionCorrect++;sessionStars++;}
    save();
    document.querySelectorAll(".answer-option").forEach(button=>{
      const idx=Number(button.dataset.index);button.disabled=true;
      if(idx===q.correct)button.classList.add("correct");
      if(idx===chosen&&!correct)button.classList.add("wrong");
    });
    const feedback=$("#feedback");feedback.hidden=false;feedback.className="feedback "+(correct?"good":"try-again");
    const lead=document.createElement("strong");lead.textContent=correct?"Nice one! +1 star. ":"Good try! ";
    feedback.append(lead,document.createTextNode(q.explanation));
    $("#next-question").disabled=false;
    $("#next-question").innerHTML=questionIndex===quizQuestions.length-1?'See my results <span>→</span>':'Next question <span>→</span>';
    $("#next-question").onclick=nextQuestion;
  }
  function nextQuestion(){
    if(!locked)return;
    questionIndex++;
    if(questionIndex>=quizQuestions.length){showResults();return;}
    renderQuestion();
  }
  function showResults(){
    $("#quiz-progress-text").textContent="DONE!";
    $("#quiz-progress-fill").style.width="100%";
    $("#quiz-stage").hidden=true;$("#results-stage").hidden=false;
    $("#results-title").textContent=sessionCorrect===quizQuestions.length?"Quest conquered!":sessionCorrect>=Math.ceil(quizQuestions.length/2)?"You're making progress!":"Every try makes you stronger!";
    $("#results-copy").textContent=sessionCorrect===quizQuestions.length?"A perfect run. Keep that curious mind going!":"You got "+sessionCorrect+" out of "+quizQuestions.length+" right. Read the explanations, then give it another go.";
    $("#results-correct").textContent=sessionCorrect+"/"+quizQuestions.length;
    $("#results-earned").textContent=sessionStars+" ★";
    $("#quiz-progress-fill").style.width="100%";
  }
  function closeQuiz(){modal.hidden=true;document.body.style.overflow="";$("#start-quest").focus({preventScroll:true});}
  function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");window.setTimeout(()=>toast.classList.remove("show"),2400);}
  document.querySelectorAll(".grade-card").forEach(card=>card.addEventListener("click",()=>chooseGrade(card.dataset.grade)));
  $("#start-quest").addEventListener("click",()=>{document.querySelector("#quests").scrollIntoView({behavior:"smooth",block:"start"});});
  document.querySelectorAll(".launch-maths").forEach(button=>button.addEventListener("click",openQuiz));
  $("#close-quiz").addEventListener("click",closeQuiz);
  $("#next-question").addEventListener("click",()=>{if(locked)nextQuestion();else checkAnswer();});
  $("#play-again").addEventListener("click",openQuiz);
  $("#back-to-board").addEventListener("click",closeQuiz);
  $("#reset-progress").addEventListener("click",()=>{
    if(!confirm("Clear your saved question count, correct answers and stars on this device?"))return;
    progress=defaultProgress();save();showToast("Progress reset. A fresh adventure awaits!");
  });
  modal.addEventListener("click",event=>{if(event.target===modal)closeQuiz();});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!modal.hidden)closeQuiz();});
  chooseGrade(3);updateStats();
})();