<div class="accordion" id="cannedMessagesSidebar">
  <div class="card">
    <div class="card-header" id="headingOne">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Collapsible Group Item #1
        </button>
      </h2>
    </div>

    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#cannedMessagesSidebar">
      <div class="card-body">
        Some placeholder content for the first accordion panel. This panel is shown by default, thanks to the <code>.show</code> class.
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header" id="headingThree">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Collapsible Group Item #3
        </button>
      </h2>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#cannedMessagesSidebar">
      <div class="card-body">
        And lastly, the placeholder content for the third and final accordion panel. This panel is hidden by default.
      </div>
    </div>
  </div>
</div>

function makeMessageGroup (groupIndex, parentID) {
  const headingID = `messageGroupHeading${groupIndex}`
  const collapseID = `messageGroupCollapse${groupIndex}`
  const listID = `messageGroupList${groupIndex}`

  const HTML = `<div class="card">
    <div class="card-header" id="${headingID}">
      <h2 class="mb-0">
        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#${collapseID}" aria-expanded="false" aria-controls="${collapseID}">
          Collapsible Group Item #2
        </button>
      </h2>
    </div>
    <div id="${collapseID}" class="collapse" aria-labelledby="${headingID}" data-parent="#${parentID}">
      <div class="card-body">
        <ul class="list-group list-group-flush" id="">
          <li class="list-group-item">An item</li>
          <li class="list-group-item">A second item</li>
          <li class="list-group-item">A third item</li>
          <li class="list-group-item">A fourth item</li>
          <li class="list-group-item">And a fifth one</li>
        </ul>
      </div>
    </div>
  </div>`
}
