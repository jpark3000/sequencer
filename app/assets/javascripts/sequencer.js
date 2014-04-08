var audioContext = new webkitAudioContext();
var colSelected = 0;
var timeoutId = 0;
var filter = audioContext.createBiquadFilter();
var filterDetune = -3000;
var filterQ = 1;






function playNote(freq) {
 
  var oscillator = audioContext.createOscillator();
  
  oscillator.connect(filter);
  filter.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  
  filter.type = 1;


  filter.Q.value = filterQ;
  filter.detune.value = filterDetune;




  
  oscillator.noteOn(0);
  setTimeout(function() {
    oscillator.noteOff(0)
  }, 200);

};





function run() {
  var current = colSelected += 1;
  var previous = colSelected - 1;
  if (previous <= 0) previous = 16

  var $step = $('tr td:nth-child('+current+')')
  var prevStep = $('tr td:nth-child('+previous+')')

  $step.addClass('selected');
  prevStep.removeClass('selected');

  $.each($step, function(index, value) { 
    if ($($step[index]).attr('class') == 'play selected') {
      var freq = $($step[index]).parent().data('freq')
      playNote(freq);
    };

  })

  timeoutId = setTimeout(run, 200);
  if (colSelected >= 16) colSelected = 0;
}

function enableStep() {
  $('tr').click(function(e) {
    $(e.target).toggleClass('play');
  })
};

function tracking() {
  var canvas = document.getElementById("xycontroller");
  var ctx = canvas.getContext('2d')

  $(canvas).mousemove(function(e) {
    var x = -3000;
    x += (e.pageX) * 12;
    filterDetune = x;

    var y = 1;
    y += (e.pageY - this.offsetTop) / 3;
    filterQ = y
    // console.log(filterQ);

  });

  $(canvas).mouseleave(function() {
    filterDetune = -3000;
    filterQ = 1
  });


};







$(document).ready(function() {
  enableStep();
  tracking();
  $('#play').on('click', run);
  $('#pause').on('click', function() {
    clearTimeout(timeoutId);
  });


});
