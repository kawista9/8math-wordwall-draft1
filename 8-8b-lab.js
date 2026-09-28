(() => {
  const TASKS = [
    {
      equation:"18 + 4x = 42 + 2x",
      question:"Which situation can be represented by this equation?",
      options:[
        ["Art Club A has 18 beads and adds 2 each day. Art Club B has 42 beads and adds 4 each day. After how many days, x, will they have the same number of beads?","The daily rates are reversed: 4 belongs with 18 and 2 belongs with 42."],
        ["Art Club A has 18 beads and gives away 4 each day. Art Club B has 42 beads and adds 2 each day. After how many days, x, will they have the same number of beads?","Club A would be 18 − 4x, but the equation adds 4x."],
        ["Art Club A has 18 beads and adds 4 each day. Art Club B has 42 beads and adds 2 each day. After how many days, x, will they have the same number of beads?",""],
        ["Art Club A has 18 beads and adds 4 each day. Art Club B has 42 beads and adds 2 each day. After how many days, x, will Club A have more beads?","“More than” requires >, while the equation uses =."]
      ],
      correct:2, explanation:"18 and 42 are the starting amounts; 4x and 2x are the amounts added after x days. “The same” gives =."
    },
    {
      equation:"12 + 2.5x < 4 + 4x",
      question:"Which situation can be represented by this inequality?",
      options:[
        ["Print Shop A charges a $12 setup fee plus $2.50 per poster. Print Shop B charges a $4 setup fee plus $4 per poster. For x posters, when will A cost less than B?",""],
        ["Print Shop A charges a $12 setup fee plus $4 per poster. Print Shop B charges a $4 setup fee plus $2.50 per poster. For x posters, when will A cost less than B?","The poster rates have been switched between the shops."],
        ["Print Shop A charges a $12 setup fee plus $2.50 per poster. Print Shop B charges a $4 setup fee plus $4 per poster. For x posters, when will A cost more than B?","“More than” gives >, but the inequality uses <."],
        ["Print Shop A charges $12 per poster plus a $2.50 setup fee. Print Shop B charges $4 per poster plus a $4 setup fee. For x posters, when will A cost less than B?","The first shop would be 2.5 + 12x, not 12 + 2.5x."]
      ],
      correct:0, explanation:"Each setup fee is a constant. Each per-poster charge multiplies x. Shop A is on the left of <."
    },
    {
      equation:"75 − 4x ≥ 30 + 5x",
      question:"Which situation can be represented by this inequality?",
      options:[
        ["Warehouse A has 75 cartons and receives 4 more each day. Warehouse B has 30 cartons and receives 5 more each day. After x days, when will A have at least as many cartons as B?","Warehouse A ships 4 cartons, so its total decreases to 75 − 4x."],
        ["Warehouse A has 75 cartons and ships 4 each day. Warehouse B has 30 cartons and receives 5 each day. After x days, when will A have at most as many cartons as B?","“At most” gives ≤, while the inequality uses ≥."],
        ["Warehouse A has 30 cartons and ships 4 each day. Warehouse B has 75 cartons and receives 5 each day. After x days, when will A have at least as many cartons as B?","The starting amounts are switched; A starts with 75."],
        ["Warehouse A has 75 cartons and ships 4 each day. Warehouse B has 30 cartons and receives 5 each day. After x days, when will A have at least as many cartons as B?",""]
      ],
      correct:3, explanation:"Shipping subtracts 4x from 75; receiving adds 5x to 30. “At least” means ≥."
    },
    {
      equation:"6x + 2x ≤ 18 + 4x",
      question:"Which situation can be represented by this inequality?",
      options:[
        ["Company A charges $6 per kit plus a one-time $2 packaging fee. Company B charges an $18 order fee plus $4 per kit. For x kits, when is A no more expensive than B?","A one-time fee would be + 2, but the equation shows + 2x."],
        ["Company A charges $6 per kit plus $2 per kit for packaging. Company B charges an $18 order fee plus $4 per kit. For x kits, when is A no more expensive than B?",""],
        ["Company A charges $6 per kit plus $2 per kit for packaging. Company B charges an $18 order fee plus $4 per kit. For x kits, when is A more expensive than B?","“More expensive” gives >, but the inequality uses ≤."],
        ["Company A charges a $6 order fee plus $2 per kit for packaging. Company B charges $18 per kit plus a $4 order fee. For x kits, when is A no more expensive than B?","The fixed fees and per-kit charges do not match either side of the inequality."]
      ],
      correct:1, explanation:"Both $6 and $2 are charged for each kit, so both terms on the left contain x. Only B has an $18 fixed fee."
    },
    {
      equation:"2(3x + 4) + 2(x + 2) = 20 + 5x",
      question:"Which situation can be represented by this equation?",
      options:[
        ["A rectangle has length 3x + 4 units and width x + 2 units. Its area is 20 + 5x square units. Which equation represents this relationship?","Area multiplies length by width; the left side here adds two lengths and two widths."],
        ["A rectangle has length 3x + 4 units and width x + 2 units. Its perimeter is 20 + 5x units. The two adjacent sides are added once. Which equation represents this relationship?","A perimeter includes two copies of each side length."],
        ["A rectangle has length 3x + 4 units and width x + 2 units. Its perimeter is 20 + 5x units. Which equation sets the sum of all four side lengths equal to the given perimeter?",""],
        ["A rectangle has length 3x + 4 units and width x + 2 units. Its perimeter is 20 − 5x units. Which equation sets the sum of all four side lengths equal to the given perimeter?","The given perimeter has + 5x, not − 5x."]
      ],
      correct:2, explanation:"Opposite sides of a rectangle match. The perimeter is two lengths plus two widths, equal to 20 + 5x."
    },
    {
      equation:"14 + 1.5x > 30 − 0.5x",
      question:"Which situation can be represented by this inequality?",
      options:[
        ["Gift card A has $14 and receives $1.50 each week. Gift card B has $30 and is used for $0.50 each week. After x weeks, when will A have more money than B?",""],
        ["Gift card A has $14 and receives $1.50 each week. Gift card B has $30 and receives $0.50 each week. After x weeks, when will A have more money than B?","B is used for $0.50 each week, so the right side subtracts 0.5x."],
        ["Gift card A has $14 and is used for $1.50 each week. Gift card B has $30 and is used for $0.50 each week. After x weeks, when will A have more money than B?","A's balance increases by 1.5x in the inequality."],
        ["Gift card A has $14 and receives $1.50 each week. Gift card B has $30 and is used for $0.50 each week. After x weeks, when will A have less money than B?","“Less than” gives <, not >."]
      ],
      correct:0, explanation:"A gains $1.50 per week; B loses $0.50 per week. The left balance must be greater than the right balance."
    },
    {
      equation:"9 + 7x ≥ 25 + 3x",
      question:"Which situation can be represented by this inequality?",
      options:[
        ["Robot A begins 9 meters along a track and moves 7 meters per minute. Robot B begins 25 meters along the track and moves 3 meters per minute. After x minutes, when is A behind B?","“Behind” means A's position is less than B's, which would use <."],
        ["Robot A begins 25 meters along a track and moves 7 meters per minute. Robot B begins 9 meters along the track and moves 3 meters per minute. After x minutes, when is A at least as far along as B?","The starting positions have been switched."],
        ["Robot A begins 9 meters along a track and moves 3 meters per minute. Robot B begins 25 meters along the track and moves 7 meters per minute. After x minutes, when is A at least as far along as B?","The rates have been switched."],
        ["Robot A begins 9 meters along a track and moves 7 meters per minute. Robot B begins 25 meters along the track and moves 3 meters per minute. After x minutes, when is A at least as far along as B?",""]
      ],
      correct:3, explanation:"A's position is 9 + 7x; B's is 25 + 3x. “At least as far along” means ≥."
    }
  ];
  const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const reset=(data,index)=>{data.index=index;data.selected=null;data.checked=false;data.solved=false;};
  window.EQUATION_88B_TOTAL=TASKS.length;
  window.reset88BQuestion=reset;
  window.render88BLab=function({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion}){
    if(!labRuntime.data)labRuntime.data={index:0,selected:null,checked:false,solved:false};
    const data=labRuntime.data,task=TASKS[data.index],body=$("#standardsLabBody");
    setLabProgress(data.index,TASKS.length,"Choose the situation that matches every part of the given equation or inequality.");
    body.innerHTML=`<div class="b88-lab">
      <header class="b88-head"><span>8.8B · QUESTION ${data.index+1} OF ${TASKS.length}</span><h4>Match the situation</h4></header>
      <section class="b88-prompt"><p>${escapeHTML(task.question)}</p><div class="b88-equation" aria-label="Given equation or inequality">${escapeHTML(task.equation)}</div></section>
      <div class="b88-options" role="radiogroup" aria-label="Choose one situation">${task.options.map(([story],i)=>`<label class="b88-option${data.selected===i?" is-selected":""}${data.checked&&data.selected===i?(data.solved?" is-correct":" is-incorrect"):""}"><input type="radio" name="b88-answer" value="${i}" ${data.selected===i?"checked":""} ${data.solved?"disabled":""}><span class="b88-letter">${"ABCD"[i]}</span><span>${escapeHTML(story)}</span></label>`).join("")}</div>
      <div class="b88-actions"><button type="button" class="lab-action b88-check" data-b88-check ${data.solved?"disabled":""}>Check answer</button>${data.solved?`<button type="button" class="lab-next" data-b88-next>${data.index===TASKS.length-1?"Finish lab":"Next question →"}</button>`:""}</div>
      ${data.checked?`<p class="b88-explanation ${data.solved?"is-correct":"is-incorrect"}" role="status">${escapeHTML(data.solved?task.explanation:task.options[data.selected][1])}</p>`:""}
    </div>`;
    syncWhiteboardQuestion();
    body.querySelectorAll('input[name="b88-answer"]').forEach(input=>input.addEventListener("change",()=>{data.selected=Number(input.value);data.checked=false;window.render88BLab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Choice selected. Check your answer.");}));
    body.querySelector("[data-b88-check]").addEventListener("click",()=>{
      if(data.selected===null)return setLabFeedback("Choose a situation first.","incorrect");
      data.checked=true;data.solved=data.selected===task.correct;
      window.render88BLab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});
      setLabFeedback(data.solved?"Correct. Every part matches the given comparison.":task.options[data.selected][1],data.solved?"correct":"incorrect");
    });
    body.querySelector("[data-b88-next]")?.addEventListener("click",()=>{
      if(data.index===TASKS.length-1){setLabProgress(TASKS.length,TASKS.length,"All seven situations matched.");showLabCompletion("8.8B");body.querySelector(".b88-lab").hidden=true;return;}
      reset(data,data.index+1);window.render88BLab({labRuntime,$,setLabProgress,setLabFeedback,showLabCompletion,syncWhiteboardQuestion});setLabFeedback("Read the next equation and choose its matching situation.");
    });
  };
})();