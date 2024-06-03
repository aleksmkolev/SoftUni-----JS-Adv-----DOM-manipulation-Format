function solve() {
  document.querySelector("#btnSend").addEventListener("click", onClick);

  const textAreaRef = document.querySelector("textarea");

  const bestRestaurantRef = document.querySelector("#bestRestaurant p");

  const workersRef = document.querySelector("#workers p");

  function onClick() {
    const data = textAreaRef.value;

    const restaurantData = JSON.parse(data);

    const result = {};

    for (let el of restaurantData) {
      const [restaurantName, workerlist] = el.split(" - ");

      if (!result.hasOwnProperty(restaurantName)) {
        result[restaurantName] = {
          avgSalary: 0,
          bestSalary: 0,
          workers: [],
        };
      }

      const workersData = workerlist.split(", ");
      const newWorkers = createWorkerList(workersData);
      result[restaurantName].workers = concatWorker(
        result[restaurantName].workers,
        newWorkers
      );

      const restaurantSalaryData = calculateRestaurantSalaryData(
        result[restaurantName].workers
      );

      result[restaurantName].avgSalary = restaurantSalaryData.avgSalary;

      result[restaurantName].bestSalary = restaurantSalaryData.bestSalary;
    }
    const [bestRestaurantName, bestRestaurantData] = findBestRestaurant(result);

    bestRestaurantRef.textContent = `Name: ${bestRestaurantName} Average Salary: ${bestRestaurantData.avgSalary.toFixed(
      2
    )} Best Salary: ${bestRestaurantData.bestSalary.toFixed(2)}`;

    let buff = "";
    bestRestaurantData.workers
      .sort((a, b) => b.salary - a.salary)
      .forEach((x) => {
        buff += `Name: ${x.name} With Salary: ${x.salary} `;
      });

    workersRef.textContent = buff.trim();
  }

  function concatWorker(currentWorkerList, newWorkerList) {
    return currentWorkerList.concat(newWorkerList);
  }

  function calculateRestaurantSalaryData(workerlist) {
    const result = {
      avgSalary: 0,
      bestSalary: 0,
    };
    let sum = 0;
    for (let el of workerlist) {
      let { name, salary } = el;
      salary = Number(salary);
      if (result.bestSalary < salary) {
        result.bestSalary = salary;
      }
      sum += salary;
    }
    result.avgSalary = sum / workerlist.length;
    return result;
  }

  function createWorkerList(data) {
    let result = [];
    for (let el of data) {
      let [workerName, salary] = el.split(" ");
      salary = Number(salary);
      const worker = { name: workerName, salary: salary };
      result.push(worker);
    }
    return result;
  }

  function findBestRestaurant(restaurants) {
    return Object.entries(restaurants).sort(
      (a, b) => b[1].avgSalary - a[1].avgSalary
    )[0];
  }
}
