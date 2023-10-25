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

  const onChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setLicensePlate(e.currentTarget.value);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div class="flex flex-col gap-2">
          <input
            class="rounded w-full appearance-none border border-gray-300 px-3 py-2 leading-tight text-gray-800 focus:outline-none"
            type="tel"
            onInput={onChange}
            name="license"
            placeholder="License plate"
          />
          <input
            class="rounded w-full appearance-none border border-gray-300 px-3 py-2 leading-tight text-gray-800 focus:outline-none"
            type="file"
            onChange={(_) => {
              setHasFile(true);
            }}
            accept="image/png, image/jpeg"
            name="image"
          />
          <button
            class="disabled:opacity-50 disabled:hover:bg-blue-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!licensePlate() && !hasFile()}
          >
            Search
          </button>
        </div>
      </form>
      <Suspense>
        {response() && (
          <>
            <div>Name: {response().name}</div>
            <div>
              Phone: <a href={`tel:${response().phone}`}>{response().phone}</a>
            </div>
            <div>
              Whatsapp:{" "}
              <a href={`https://wa.me/${response().phone}`}>
                {response().phone}
              </a>
            </div>
          </>
        )}
      </Suspense>
    </div>
  );
}
