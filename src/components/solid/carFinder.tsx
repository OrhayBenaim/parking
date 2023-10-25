import { createResource, createSignal, Suspense, type JSX } from "solid-js";

async function postFormData(formData: FormData) {
  const response = await fetch("/api/user", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}

export default function CarFinder() {
  const [licensePlate, setLicensePlate] = createSignal("");
  const [hasFile, setHasFile] = createSignal(false);

  const [formData, setFormData] = createSignal<FormData>();
  const [response] = createResource(formData, postFormData);

  function submit(e: SubmitEvent) {
    e.preventDefault();
    setFormData(new FormData(e.target as HTMLFormElement));
  }

  const notify = (phone: string) => {
    fetch("/api/notify", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  };

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setLicensePlate(e.currentTarget.value);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div class="flex flex-col gap-2">
          <div class="flex">
            <input
              class="rounded-l w-full appearance-none border border-gray-300 px-3 py-2 leading-tight text-gray-800 focus:outline-none"
              type="tel"
              onInput={onChange}
              name="license"
              placeholder="License plate"
            />

            <div class="flex items-center justify-center">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center px-2 h-12 rounded-r cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div class="flex flex-col items-center justify-center">
                  {hasFile() ? (
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-green-300"
                      fill="none"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M4 12.6111L8.92308 17.5L20 6.5"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      fill="currentColor"
                      class="w-6 h-6 text-white"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 487 487"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9 v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  )}
                </div>
                <input
                  onChange={(_) => {
                    setHasFile(true);
                  }}
                  name="image"
                  id="dropzone-file"
                  type="file"
                  class="hidden"
                />
              </label>
            </div>
          </div>
          <button
            class="flex justify-center items-center disabled:opacity-50 disabled:hover:bg-blue-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={(!licensePlate() && !hasFile()) || response.loading}
          >
            {response.loading ? (
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#fff"
              >
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
      <Suspense>
        {response() &&
          (response().name ? (
            <>
              <div>Name: {response().name}</div>
              <div>
                Phone:{" "}
                <a href={`tel:${response().phone}`}>{response().phone}</a>
              </div>
              <div>
                Whatsapp:{" "}
                <a href={`https://wa.me/${response().phone}`}>
                  {response().phone}
                </a>
              </div>
              <button
                type="button"
                class="flex justify-center items-center disabled:opacity-50 disabled:hover:bg-blue-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  notify(response().phone);
                }}
              >
                Notify
              </button>
            </>
          ) : (
            <div>Not found</div>
          ))}
      </Suspense>
    </div>
  );
}
