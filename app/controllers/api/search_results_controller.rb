class Api::SearchResultsController < ApplicationController
  def index
    search_results = Place.search(params[:find]);
    render json: search_results
  end
end