var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function GroceryListViewModel(items) {
    var viewModel = new ObservableArray(items);
    viewModel.load = function() {
        return fetch(config.apiUrl + "Groceries", {
            headers: {
                "Authorization": "Bearer " + config.token
            }
        })
        .then(function(response) {
        return response.json();
        }).then(function(data) {
            data.Result.forEach(function(grocery) {
                viewModel.push({
                    name: grocery.Name,
                    id: grocery.Id
                });
            });
        });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.add = function(grocery) {
        return fetch(config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            viewModel.push({ name: grocery, id: data.Result.Id });
        });
    };
    return viewModel;
}

module.exports = GroceryListViewModel;