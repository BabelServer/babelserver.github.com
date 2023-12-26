$(document).ready(function () {
    let rootObjects = [];

    $("#addRootObject").click(function () {
        rootObjects.push({
            mineNumber: 0,
            money: 0,
            experience: { chance: 0, value: 0 },
            blocks: [],
        }); // Add a new root object
        updateRootObjects();
    });

    $("#import").click(function () {
        const json = $("#jsonOutput").val();
        try {
            rootObjects = JSON.parse(json);
            updateRootObjects();
        } catch (error) {
            alert("Invalid JSON");
        }
    });

    $("#export").click(function () {
        const json = JSON.stringify(rootObjects, null, 2);
        $("#jsonOutput").val(json);
    });

    function updateRootObjects() {
        $("#rootObjects").empty();
        rootObjects.forEach((rootObject, index) => {
            $("#rootObjects").append(`
                <div>
                    RootObject ${index + 1}:
                    <label for="mineNumber${index}">mineNumber:</label>
                    <input type="number" id="mineNumber${index}" value="${rootObject.mineNumber}">
                    <label for="money${index}">money:</label>
                    <input type="number" id="money${index}" value="${rootObject.money}">
                    <label>experience:</label>
                    <label for="chance${index}">chance:</label>
                    <input type="number" id="chance${index}" value="${rootObject.experience.chance}">
                    <label for="value${index}">value:</label>
                    <input type="number" id="value${index}" value="${rootObject.experience.value}">
                    <button class="deleteRootObject" data-index="${index}">Delete</button>
                    <label>Blocks:</label>
                    <button class="addBlock" data-index="${index}">Add</button>
                    <div id="blocks${index}"></div>
                </div>
            `);
            updateBlocks(index);
        });

        $(".deleteRootObject").click(function () {
            const index = $(this).data("index");
            rootObjects.splice(index, 1); // Remove the root object at the given index
            updateRootObjects();
        });

        $(".addBlock").click(function () {
            const index = $(this).data("index");
            rootObjects[index].blocks.push({
                typeId: "",
                location: { x: 0, y: 0, z: 0 },
                slot: 0,
                money: 0,
                experience: { chance: 0, value: 0 },
                errorName: "",
            }); // Add a new block
            updateBlocks(index);
        });

        $("input").keyup(function () {
            const index = $(this).attr("id").match(/\d+/)[0]; // Get the index from the id
            const field = $(this).attr("id").replace(index, ""); // Get the field name from the id
            rootObjects[index][field] = $(this).val(); // Update the root object data
        });
    }

    function updateBlocks(rootIndex) {
        const blocksDiv = $(`#blocks${rootIndex}`);
        blocksDiv.empty();
        rootObjects[rootIndex].blocks.forEach((block, index) => {
            blocksDiv.append(`
            <div>
                Block ${index + 1}:
                <label for="typeId${rootIndex}_${index}">typeId:</label>
                <input type="text" id="typeId${rootIndex}_${index}" value="${block.typeId}">
                <label>location:</label>
                <label for="x${rootIndex}_${index}">x:</label>
                <input type="number" id="x${rootIndex}_${index}" value="${block.location.x}">
                <label for="y${rootIndex}_${index}">y:</label>
                <input type="number" id="y${rootIndex}_${index}" value="${block.location.y}">
                <label for="z${rootIndex}_${index}">z:</label>
                <input type="number" id="z${rootIndex}_${index}" value="${block.location.z}">
                <label for="slot${rootIndex}_${index}">slot:</label>
                <input type="number" id="slot${rootIndex}_${index}" value="${block.slot}">
                <label for="money${rootIndex}_${index}">money:</label>
                <input type="number" id="money${rootIndex}_${index}" value="${block.money}">
                <label>experience:</label>
                <label for="chance${rootIndex}_${index}">chance:</label>
                <input type="number" id="chance${rootIndex}_${index}" value="${block.experience.chance}">
                <label for="value${rootIndex}_${index}">value:</label>
                <input type="number" id="value${rootIndex}_${index}" value="${block.experience.value}">
                <label for="errorName${rootIndex}_${index}">errorName:</label>
                <input type="text" id="errorName${rootIndex}_${index}" value="${block.errorName}">
                <button class="deleteBlock" data-root-index="${rootIndex}" data-index="${index}">Delete</button>
            </div>
        `);
        });

        $(".deleteBlock").click(function () {
            const rootIndex = $(this).data("root-index");
            const index = $(this).data("index");
            rootObjects[rootIndex].blocks.splice(index, 1); // Remove the block at the given index
            updateBlocks(rootIndex);
        });

        $("input").keyup(function () {
            const ids = $(this).attr("id").match(/\d+/g); // Get the indices from the id
            const rootIndex = ids[0];
            const index = ids[1];
            const field = $(this).attr("id").replace(`${rootIndex}_${index}`, ""); // Get the field name from the id
            if (index === undefined) {
                if (field === "chance" || field === "value") {
                    rootObjects[rootIndex].experience[field] = $(this).val(); // Update the experience data
                } else {
                    rootObjects[rootIndex][field] = $(this).val(); // Update the root object data
                }
            } else {
                if (field === "x" || field === "y" || field === "z") {
                    rootObjects[rootIndex].blocks[index].location[field] = $(this).val(); // Update the location data
                } else if (field === "chance" || field === "value") {
                    rootObjects[rootIndex].blocks[index].experience[field] = $(this).val(); // Update the experience data
                } else {
                    rootObjects[rootIndex].blocks[index][field] = $(this).val(); // Update the block data
                }
            }
        });
    }
});
