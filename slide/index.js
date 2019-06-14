
<script>
  $( function() {
    $( "button" ).click( function() {
      $(this).before( "<div class='box'>New box</div>" );
    });
  });
</script>

<script>
$(function() {
  $("#getData").click(function() {
  
    // Put artistList element and JSON file location into a variable
    var artistList = $("#artistList");
    var url = "https://www.quackit.com/jquery/examples/artists.txt";

    // Get the JSON file
    $.getJSON(url, function(data) {

      // Put artist info into a variable
      var artists = data.artists.map(function(item) {
        return item.artistname + " (" + item.born + ")";
      });
      
      // Remove all child nodes (including text nodes) 
      artistList.empty();

      // Format artists with HTML tags 
      if (artists.length) {
        var content = "<li>" + artists.join("</li><li>") + "</li>";
        var list = $("<ul>").html(content);
        artistList.append(list);
      }
    });
  });
});
</script>
