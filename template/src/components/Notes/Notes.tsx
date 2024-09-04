const Notes = () => {
  return (
    <>
      <div className="flex gap-10 rounded-3xl p-6 bg-base-300 bg-opacity-50 h-full">
        <main className="flex-1 mb-6">
          <div className="flex flex-col h-full">
            <header className="basis-2/10 h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
              <div className="dropdown dropdown-bottom dropdown-end">
                <button
                  tabIndex={0}
                  className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
                >
                  Add Participant
                </button>
                <div
                  tabIndex={0}
                  className="inline-block dropdown-content menu bg-base-100 rounded-box z-[1] w-96 p-6 shadow"
                >
                  <button className="mt-6 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white">
                    Add
                  </button>
                </div>
              </div>
            </header>
            <div className="relative flex flex-col rounded-3xl bg-base-300 bg-opacity-50 h-full">
              <main className="basis-8/10 h-auto flex-1 overflow-y-scroll px-6"></main>
              <div className="sticky flex flex-col gap-3 bottom-0 p-5 border-t border-gray-700"></div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Notes;
